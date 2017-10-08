# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, unicode_literals
)
"""
Ask for report again, 1 week AFTER screening.
"""

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import datetime, timedelta
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.email_connector import parse_and_send, get_smtp_conn
from email_scripts.utils import myprint
from smartencoding import smart_unicode_with_ignore

SUBJECT = "Precisamos saber como foi a sua sessão no dia {screening[date]:%d/%m}."
TPL_NAME = "ask_for_report_take2.html"

def filter_and_send():
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    # cron take some seconds to call the script so we replace here to 0
    now = datetime.now().replace(second=0, microsecond=0)

    # myprint("DEBUG, should find ELENA with session at 2017-09-14 15:00:00")
    # now = datetime(2017, 9, 21, 15, 0)

    start = now - timedelta(weeks=1)
    end = start + timedelta(minutes=5)

    query = films.find({
        "screening.date": {"$gte": start, "$lt": end}
    })
    myprint(
        "Getting screenings from {:%Y-%m-%d %H:%M:%S} to {:%Y-%m-%d %H:%M:%S}."
        .format(start, end)
    )
    found = 0
    server = None

    for film in query:
        for screening in film['screening']:
            created_at = screening.get('created_at', None)
            screening_date = screening.get('date', None)
            report = screening.get('report_description', None)

            if not created_at or not screening_date:
                continue # too old screening

            if screening_date >= start and screening_date < end and not report:

                if not server:
                    server = get_smtp_conn()

                ambassador = \
                    users.find_one({"_id": screening['user_id']})

                myprint("{} :: {} :: {}".format(
                    created_at, screening_date,
                    smart_unicode_with_ignore(film['title'])
                ))

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
    myprint("Mails sent: {}".format(found))

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
