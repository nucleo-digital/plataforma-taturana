# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

import os
from pymongo import  MongoClient
from email_scripts.config_loader import get_conf


def get_conn():
    conf = get_conf()
    cli = MongoClient(conf["db"]["host"], conf["db"]["port"])
    db = cli.get_database(conf["db"]["name"])
    return cli, db
