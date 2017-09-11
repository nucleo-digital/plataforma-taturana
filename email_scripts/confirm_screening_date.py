# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)
"""
Confirmacao da data da sessão 10 dias antes da sessão
"""

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import datetime, timedelta
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.email_connector import parse_and_send, get_smtp_conn

SUBJECT = u"Tudo certo para a sua sessão?"
TPL_NAME = "confirm_screening_date.html"

T10 = timedelta(days=10).total_seconds()

def filter_and_send():
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    now = datetime.now()

    # print("DEBUG >= 10 dias, deve pegar ELENA c/ sessão em 2017-09-14 15:00:00")
    # now = datetime(2017, 9, 4, 15, 05)

    end = now + timedelta(days=10)
    start = end - timedelta(minutes=5)
    query = films.find({
        "screening.date": {"$gte": start, "$lt": end}
    })
    print(
        "Getting screenings from {:%Y-%m-%d %H:%M:%S} to {:%Y-%m-%d %H:%M:%S}."
        .format(start, end)
    )

    found = 0
    server = None

    for film in query:
        for screening in film['screening']:
            created_at = screening.get('created_at', None)
            screening_date = screening.get('date', None)

            if not created_at or not screening_date:
                continue  # too old screening

            if screening_date >= start and screening_date < end:

                delta = screening_date - created_at
                if delta.total_seconds() < T10:
                    continue

                print(
                    "FOUND => days: {days} :: created: {created_at} :: screening date"
                    ": {screening_date} :: {film}".format(
                        film=film['title'],
                        created_at=created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        screening_date=screening_date.strftime("%Y-%m-%d %H:%M:%S"),
                        days=10
                    )
                )

                if not server:
                    server = get_smtp_conn()

                ambassador = \
                    users.find_one({"_id": screening['user_id']})

                parse_and_send(
                    server=server,
                    _from=const.FROM,
                    to=ambassador['emails'][0]['address'],
                    subject=SUBJECT,
                    template=TPL_NAME,
                    context={
                        'ambassador': ambassador,
                        'movie': film,
                        'screening': screening
                    }
                )

                found += 1

    print("Mails sent: {}".format(found))

if __name__ == '__main__':
    filter_and_send()
