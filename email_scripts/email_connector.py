# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, unicode_literals
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
from email_scripts.config_loader import get_conf
from email_scripts.tpl_loader import get_template
from email_scripts.utils import myprint
# from email_scripts.error_tracker import client

from smartencoding import smart_unicode_with_ignore

Charset.add_charset('utf-8', Charset.QP, Charset.QP, 'utf-8')

BASE_CONTEXT = {
    'absoluteurl': const.ABSOLUTE_URL,
}

# def log_send_email_to_db(method):
#     def logger(server, _from, to, subject, html, headers=None):
#         exc_msg = ''
#         indent = ''
#         try:
#             result = method(server, _from, to, subject, html, tag, headers=headers)
#         except Exception as exc:
#             client.captureException()
#             indent = client.get_indent()
#         finally:
#             cli, db = get_conn()
#             log = db['email_logging']
#
#             log.insert_one({
#                 'caller': log_info['caller'],
#                 'movie': log_info['movie_id'],
#                 'screening': {
#                     'id': log_info['screening_id'],
#                     ''
#                 },
#                 'screening'
#                 'to': to,
#                 'subject': subject,
#                 ''
#             })


def split_smtp_uri(uri):
    params = re.search(
        r'smtp://(?P<username>[^:]+):(?P<pwd>[^@]+)@(?P<domain>[^:]+)'
        r':(?P<port>\d+)', uri
    )
    if not params:
        raise ValueError("Cannot load smtp data!")
    return params.groups()


def get_smtp_conn():
    conf = get_conf()['email']
    user, pwd, url, port = split_smtp_uri(conf['uri'])
    server = smtplib.SMTP(url, port)
    server.ehlo()
    server.starttls()
    server.login(user, pwd)
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
    conf = get_conf()['email']
    text = strip_html(html)
    test_email = os.environ.get('TEST_EMAIL', None)
    if conf["emails_for_real"] and test_email is None:
        to = [to]
        subject = "{}".format(subject)
    else:

        if test_email:
            to = [test_email]
        else:
            to = conf["debug_emails"]
        subject = "(TESTE) {}".format(subject)
    for _to in to:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = _from
        msg['To'] = _to
        msg.attach(MIMEText(text, 'plain', 'UTF-8'))
        msg.attach(MIMEText(html, 'html', 'UTF-8'))

        sent = server.sendmail(msg['From'], msg['To'], msg.as_string())

        myprint(  # TODO: add logging
            "Email sent to {} with title \"{}\"".format(
                *map(smart_unicode_with_ignore, [msg['To'], subject])
            )
        )
    return sent
