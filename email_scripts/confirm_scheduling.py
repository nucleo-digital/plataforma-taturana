# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)
"""
Deve ser disparado 12 hrs após a confirmação do agendamento.
"""

import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))

from datetime import datetime, timedelta
from email_scripts import const
from email_scripts.mongo_connector import get_conn
from email_scripts.email_connector import parse_and_send, get_smtp_conn

SUBJECT = u"Você tem uma sessão agendada!"
TPL_NAME = "confirm_scheduling.html"

def filter_and_send():
    cli, db = get_conn()
    films = db['films']
    users = db['users']
    start = datetime.today() - timedelta(hours=24 * 10)
    query = films.find({"screening.created_at": {"$gte": start}})
    server = None
    for film in query:
        print()
        for screening in film['screening']:
            created_at = screening.get('created_at', None)
            if created_at and created_at >= start:
                print("{} :: {}".format(film['title'], created_at))
                if not server:
                    server = get_smtp_conn()
                ambassador = \
                    users.find_one({"_id": screening['user_id']})
                parse_and_send(
                    server=server,
                    _from=const.FROM,
                    to=ambassador['emails'][0].address,
                    subject=SUBJECT,
                    template=TPL_NAME,
                    context={
                        'ambassador': ambassador,
                        'movie': film
                    }
                )

if __name__ == '__main__':

    filter_and_send()
