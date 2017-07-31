# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

import re
import os
import smtplib
from bs4 import BeautifulSoup
from email import Charset
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email_scripts import const
from email_scripts.tpl_loader import get_template


Charset.add_charset('utf-8', Charset.QP, Charset.QP, 'utf-8')


CONF_FILE=os.environ.get('TATURANA_CONF_FILE', None)

if CONF_FILE is None:
    raise ValueError("Need to define environment variable TATURANA_CONF_FILE to file where SMTP configuration exists")

with open(CONF_FILE, 'r') as f:
    SMTP_URI = re.search(r'MAIL_URL=(.*)', f.read()).groups()[0]

SMTP_PARAMS = re.search(
    r'smtp://(?P<username>[^:]+):(?P<pwd>[^@]+)@(?P<domain>[^:]+)'
    r':(?P<port>\d+)', SMTP_URI
)
if SMTP_PARAMS is None:
    raise ValueError("Cannot load smtp data from {}.".format(CONF_FILE))

SMTP_USER, SMTP_PWD, SMTP_DOMAIN, SMTP_PORT = SMTP_PARAMS.groups()

BASE_CONTEXT = {
    'absoluteurl': const.ABSOLUTE_URL,
}

def get_smtp_conn():
    server = smtplib.SMTP(SMTP_DOMAIN, SMTP_PORT)
    server.ehlo()
    server.starttls()
    server.login(SMTP_USER, SMTP_PWD)
    return server

def parse_and_send(server, _from, to, subject, template, context,
                   headers=None):
    _context = BASE_CONTEXT.copy()
    _context.update(context)
    subject = subject.format(**context)
    _context['subject'] = subject
    text = get_template(template).render(**_context)
    return send_email(server, _from, to, subject, text, headers=headers)

def strip_html(html):
    soup = BeautifulSoup(html, 'lxml')

    # kill all script and style elements
    for item in soup(["script", "style", "title"]):
        item.extract()    # rip it out

    # get text
    text = soup.get_text()

    # break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)
    return text

def send_email(server, _from, to, subject, html, headers=None):
    text = strip_html(html)
    # print(text)
    # return True
    msg = MIMEMultipart('alternative')
    msg['Subject'] = Header(subject, 'utf-8')
    msg['From'] = _from
    msg['To'] = 'felipeprenholato+taturana@gmail.com'  # to
    msg.attach(MIMEText(text, 'plain', 'UTF-8'))
    msg.attach(MIMEText(html, 'html', 'UTF-8'))

    sent = server.sendmail(msg['From'], msg['To'], msg.as_string())
    print(  # TODO: add logging
        u"Email sent to {} with title \"{}\"".format(
            to, subject
        )
    )
    return sent
