# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

from pymongo import  MongoClient

def get_conn():
    cli = MongoClient('localhost', 3001)
    db = cli.meteor
    return cli, db
