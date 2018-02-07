# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, unicode_literals
)
"""
Send the movie link. Happens 7 days before section.
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

SUBJECT = "Download do filme {movie[title]}."
TPL_NAME = "send_the_movie_{}.html"

T10 = timedelta(
    days=10  #, hours=23, minutes=59, seconds=59, microseconds=99999
).total_seconds()

def filter_and_send_10_days():
    from datetime import datetime
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    # cron take some seconds to call the script so we replace here to 0
    now = datetime.now().replace(second=0, microsecond=0)

    # myprint("DEBUG >= 10 dias, should find ELENA session 2017-09-14T15:00:00Z")
    # now = datetime(2017, 9, 7, 15, 0, 0)

    start = now + timedelta(days=7)
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

            if screening.get('user_id') != 'kwoicbbJMkKvF6dSR':
                continue

            created_at = screening.get('created_at', None)
            screening_date = screening.get('date', None)

            if not created_at or not screening_date:
                continue # too old screening

            if screening_date and screening_date >= start and screening_date < end:

                delta = screening_date - created_at

                if delta.total_seconds() < T10:
                    continue  # this method proccess only with 10 or more days of delta

                if not server:
                    server = get_smtp_conn()

                ambassador = \
                    users.find_one({"_id": screening['user_id']})

                myprint("{} :: {} :: {} :: {}".format(
                    created_at, screening_date,
                    ambassador,
                    smart_unicode_with_ignore(film['title'])
                ))

                parse_and_send(
                    server=server,
                    _from=const.FROM,
                    to=ambassador['emails'][0]['address'],
                    subject=SUBJECT,
                    template=TPL_NAME.format(10),
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

    filter_and_send_10_days()

    if freezer:
        freezer.stop()
