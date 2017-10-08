# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

from smartencoding import smart_unicode_with_ignore

def myprint(t):
    print(smart_unicode_with_ignore(t))
