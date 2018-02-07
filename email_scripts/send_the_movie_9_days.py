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

T4 = timedelta(
    days=4  #, hours=23, minutes=59, seconds=59, microseconds=99999
).total_seconds()
T9 = timedelta(
    days=9, hours=23, minutes=59, seconds=59, microseconds=99999
).total_seconds()

def filter_and_send_9_days():
    from datetime import datetime
    cli, db = get_conn()
    films = db['films']
    # {
    users = db['users']
    # cron take some seconds to call the script so we replace here to 0
    now = datetime.now().replace(second=0, microsecond=0)
    # myprint("DEBUG >= 4 e <= 9, should find ELENA created at 2017-09-03 14:03:40")
    # now = datetime(2017, 9, 5, 14, 0, 0)

    # Dates are in UTC
    # "_id" : "GiWtfWAaDXjNRfjtc",
    # "title" : "Realidade Visceral",
    #     "date" : ISODate("2017-11-02T11:00:00.000Z"),
    #     "created_at" : ISODate("2017-10-26T06:22:12.349Z"),
    #     "user_id" : "io9RPivt6s9TpSMpg",
    #     "_id" : "487852f4b13f70fc87f53281"
    # }

    start = now + timedelta(days=2)
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
        # if u'Visceral' in film['title']:
        #     print("Now", now)
        #     print("Start", start)
        #     print("End", end)
        for screening in film['screening']:

            if screening.get('user_id') != 'kwoicbbJMkKvF6dSR':
                continue

            created_at = screening.get('created_at', None)
            screening_date = screening.get('date', None)

            if not created_at or not screening_date:
                continue # too old screening
            # if screening['user_id'] == u'io9RPivt6s9TpSMpg':
            #     import ipdb; ipdb.set_trace()

            if created_at >= start and created_at < end:
                delta = screening_date - created_at

                if delta.total_seconds() < T4 or delta.total_seconds() > T9:
                    continue

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
                    template=TPL_NAME.format(9),
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

    filter_and_send_9_days()

    if freezer:
        freezer.stop()
