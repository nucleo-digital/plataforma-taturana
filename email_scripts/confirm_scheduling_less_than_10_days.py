# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, unicode_literals
)
"""
Deve ser disparado 12 hrs após a confirmação do agendamento.
Agende para rodar de 5 em 5 minutos.
"""

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import timedelta
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.email_connector import parse_and_send, get_smtp_conn
from email_scripts.utils import myprint
from smartencoding import smart_unicode_with_ignore

SUBJECT = "Você tem uma sessão agendada!"
TPL_NAME = "confirm_scheduling_{}.html"

T3 = timedelta(
    days=3, hours=23, minutes=59, seconds=59, microseconds=99999
).total_seconds()
T9 = timedelta(
    days=9, hours=23, minutes=59, seconds=59, microseconds=99999
).total_seconds()


def filter_and_send():
    from datetime import datetime
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    # cron take some seconds to call the script so we replace here to 0
    now = datetime.now().replace(second=0, microsecond=0)

    # myprint("DEBUG >= 10 dias, should find ELENA created at 2017-08-31 11:49:11")
    # now = datetime(2017, 8, 31, 23, 50, 0)
    # now = datetime(2017, 9, 21, 2, 0, 0)

    # myprint("DEBUG >= 4 e <= 9, should find ELENA created at 2017-09-03 14:03:40")
    # now = datetime(2017, 9, 4, 2, 3, 45)

    # myprint("DEBUG <= 3 dias, should find ELENA created at 2017-07-04 15:39:07")
    # now = datetime(2017, 7, 5, 3, 40)

    end = now
    start = end - timedelta(minutes=5)
    query = films.find({
        "screening.created_at": {"$gte": start, "$lt": end}
    })
    myprint(
        "Getting screenings from {:%Y-%m-%d %H:%M:%S} to {:%Y-%m-%d %H:%M:%S}."
        .format(start, end)
    )

    found = {'<=3': 0, '>3 and <=9': 0}
    server = None

    for film in query:
        for screening in film['screening']:
            created_at = screening.get('created_at', None)
            screening_date = screening.get('date', None)

            if not created_at or not screening_date:
                continue  # too old screening

            if created_at >= start and created_at < end:

                delta = screening_date - created_at

                if delta.total_seconds() <= T3:
                    days = 3
                    found['<=3'] += 1
                elif delta.total_seconds() <= T9:
                    days = 9
                    found['>3 and <=9'] += 1
                else:
                    myprint("Film {} should not be here!".format(film['title']))

                myprint(
                    "FOUND => days: {days} :: created: {created_at} :: screening date"
                    ": {screening_date} :: {film}".format(
                        film=smart_unicode_with_ignore(film['title']),
                        created_at=created_at.strftime("%Y-%m-%d %H:%M:%S"),
                        screening_date=screening_date.strftime("%Y-%m-%d %H:%M:%S"),
                        days=days
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
                    template=TPL_NAME.format(days),
                    context={
                        'ambassador': ambassador,
                        'movie': film,
                        'screening': screening
                    }
                )

    myprint("Mails sent:")
    for k, v in found.items():
        myprint("{}: {}".format(k, v))

if __name__ == '__main__':
    import os
    from freezegun import freeze_time
    from datetime import datetime

    freezer = None
    try:
        fake_date = datetime.strptime(
            os.environ.get('FAKE_DATE'), '%Y%m%d%H%M%S'
        )
    except:
        fake_date = None

    if fake_date:
        freezer = freeze_time(fake_date)
        freezer.start()

    filter_and_send()

    if freezer:
        freezer.stop()
