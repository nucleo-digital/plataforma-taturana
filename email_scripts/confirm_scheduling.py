# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)
"""
Deve ser disparado 12 hrs após a confirmação do agendamento.
Agende para rodar de 5 em 5 minutos.
"""

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import datetime, timedelta
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.email_connector import parse_and_send, get_smtp_conn

SUBJECT = u"Você tem uma sessão agendada!"
TPL_NAME = "confirm_scheduling_{}.html"

T3 = timedelta(days=3).total_seconds()
T9 = timedelta(days=9).total_seconds()

def filter_and_send():
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    now = datetime.now()

    # print("DEBUG >= 10 dias, should find ELENA created at 2017-08-31 11:49:11")
    # now = datetime(2017, 8, 31, 23, 50, 0)

    # print("DEBUG >= 4 e <= 9, should find ELENA created at 2017-09-03 14:03:40")
    # now = datetime(2017, 9, 4, 2, 3, 45)

    # print("DEBUG <= 3 dias, should find ELENA created at 2017-07-04 15:39:07")
    # now = datetime(2017, 7, 5, 3, 40)

    end = now - timedelta(hours=12)
    start = end - timedelta(minutes=5)
    query = films.find({
        "screening.created_at": {"$gte": start, "$lt": end}
    })
    print(
        "Getting screenings from {:%Y-%m-%d %H:%M:%S} to {:%Y-%m-%d %H:%M:%S}."
        .format(start, end)
    )

    found = {'<=3': 0, '>3 and <=9': 0, '>=10': 0}
    server = None

    for film in query:
        for screening in film['screening']:
            created_at = screening.get('created_at', None)
            screening_date = screening.get('date', None)

            if not created_at or not screening_date:
                continue  # too old screening

            if created_at and created_at >= start and created_at < end:

                delta = screening_date - created_at

                if delta.total_seconds() <= T3:
                    days = 3
                    found['<=3'] += 1
                elif delta.total_seconds() <= T9:
                    days = 9
                    found['>3 and <=9'] += 1
                else:
                    days = 10
                    found['>=10'] += 1

                ambassador = \
                    users.find_one({"_id": screening['user_id']})

                if not server:
                    server = get_smtp_conn()

                print(
                    "FOUND => days: {days} :: created: {created_at} :: screening date"
                    ": {screening_date} :: {film}".format(
                        film=film['title'],
                        created_at=created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        screening_date=screening_date.strftime("%Y-%m-%d %H:%M:%S"),
                        days=days
                    )
                )

                parse_and_send(
                    server=server,
                    _from=const.FROM,
                    to=ambassador['emails'][0]['address'],
                    subject=SUBJECT,
                    template=TPL_NAME.format(days),
                    context={
                        'ambassador': ambassador,
                        'movie': film,
                        'screening': screening
                    }
                )

    print("Mails sent:")
    for k, v in found.items():
        print("{}: {}".format(k, v))

if __name__ == '__main__':
    filter_and_send()
