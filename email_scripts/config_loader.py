# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

import os
from ConfigParser import SafeConfigParser

def get_conf(fname=None):
    conf = SafeConfigParser()
    fname = fname or os.environ["TATURANA_CONF_FILE"]
    if not os.path.exists(fname):
        raise ValueError("Can't load conf file at {}".format(fname))

    try:

        with open(fname, 'r') as f:
            conf.readfp(f)

        return {
            'email': {
                'uri': conf.get('email', 'uri'),
                'debug_emails': conf.get('email', 'debug_emails').split(','),
                'emails_for_real': conf.getboolean('email', 'emails_for_real')
            },
            'db': {
                'host': conf.get('db', 'host'),
                'port': conf.getint('db', 'port'),
                'name': conf.get('db', 'name')
            }
        }
    except Exception as exc:
        raise ValueError(
            "Can't load conf file at {}. Error was: {}".format(fname, exc)
        )


if __name__ == '__main__':
    print(get_conf())
