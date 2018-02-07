# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, unicode_literals
)

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import timedelta, datetime
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.utils import myprint
from smartencoding import smart_unicode_with_ignore


def run_report():
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    now = datetime.now()

    # query = films.find({
    #     "screening.created_at": { "$exists" : False }
    # })

    query = films.find({'screening.updated_at': {'$exists': True}})
    # query = films.find({'screening.user_id': 'kwoicbbJMkKvF6dSR'})
    stop = False
    for film in query:
        # import ipdb; ipdb.set_trace()
        for screening in film.get('screening', []):
            if screening.get('user_id') != 'kwoicbbJMkKvF6dSR':
                continue
            try:
                created_at = screening.get('created_at', None)
                screening_date = screening.get('date', None)
                updated = screening.get('updated_at', None)
                #
                # if not updated:
                #     continue

                # if created_at:
                #     continue
                # if not (screening_date and screening_date >= now):
                #     continue

                user = users.find_one({'_id': screening['user_id']})
                myprint(u";".join(
                    [
                        # user and user['_id'],
                        # user and user['profile']['name'],
                        # user and user['emails'][0]['address'],
                        # film['_id'],
                        # film['title'],
                        screening['_id'],
                        str(created_at or ''),
                        str(updated or ''),
                        str(screening_date or ''),

                    ]
                ))
                xxx =db.films.update_one(
                    {"screening._id": screening['_id']},
                    {"$set": {"screening.$.created_at": now,
                              "screening.$.updated_at": now}}
                )
            except:
                pass

if __name__ == '__main__':
    run_report()
