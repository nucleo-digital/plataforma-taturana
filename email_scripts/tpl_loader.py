# -*- coding: UTF-8 -*-

from __future__ import (
    absolute_import, division, print_function, unicode_literals
)

import jinja2
from jinja2 import Environment, PackageLoader

ENV = Environment(
    loader=PackageLoader('email_scripts', '.templates'),
    autoescape=True
)

get_template = ENV.get_template
