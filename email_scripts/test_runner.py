#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, unicode_literals
)

"""
run like DTSTART='20170101000000' DTUNTIL='20170131235959' ./test_runner.py
"""
import os, sys
from datetime import datetime
from dateutil import rrule, parser
from subprocess import Popen

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
CMDS = map(lambda s: s.format(BASE_PATH), [
    "{}/run_scripts.sh confirm_scheduling",
    "{}/run_scripts.sh confirm_scheduling_less_than_10_days",
    "{}/run_scripts.sh confirm_screening_date",
    "{}/run_scripts.sh send_the_movie_10_days",
    "{}/run_scripts.sh send_the_movie_9_days",
    "{}/run_scripts.sh send_the_movie_3_days",
    "{}/run_scripts.sh ask_for_report",
    "{}/run_scripts.sh ask_for_report_take_2",
    "{}/run_scripts.sh tell_ambassador_the_results",
])

DTSTART = datetime.strptime(os.environ['DTSTART'], '%Y%m%d%H%M%S')
DTUNTIL = datetime.strptime(os.environ['DTUNTIL'], '%Y%m%d%H%M%S')

DATES = list(rrule.rrule(
    rrule.MINUTELY,
    interval=5,
    dtstart=DTSTART,
    until=DTUNTIL
))

for date in DATES:
    # env = os.environ.copy()
    # env['FAKE_DATE'] = date.strftime('%Y%m%d%H%M%S')
    #
    # for cmd in CMDS:
    #     p = Popen(cmd, env=env)
    print("Date: {}".format(date))
    os.environ['FAKE_DATE'] = date.strftime('%Y%m%d%H%M%S')
    for cmd in CMDS:
        print("Command: {}".format(cmd))
        sys.stdout.flush()
        sys.stderr.flush()
        os.system(cmd)
        print("=" * 80)

    print("\n" + "=" * 80 + "\n")
