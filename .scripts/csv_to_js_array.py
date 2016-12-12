#!/usr/bin/env python

try:
	import unicodecsv
except ImportError:
    print("Please install unicodecsv: pip install unicodecsv")

import json

with open('all_screenings_returned.csv', 'rb') as f:
    lines = unicodecsv.reader(f.readlines(), encoding='utf-8')


print json.dumps(
    map(
        lambda l: map(lambda i: i.encode('utf-8'), l), lines
    ), ensure_ascii=False
)
