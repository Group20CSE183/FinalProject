"""
This file defines the database models
"""

import datetime
from .common import db, Field, auth
from pydal.validators import *


def get_user_email():
    return auth.current_user.get('email') if auth.current_user else None

def get_time():
    return datetime.datetime.utcnow()


### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later

db.define_table('post',
                Field('user_email', default=get_user_email),
                Field('text', requires=IS_NOT_EMPTY()),
                Field('date', requires=IS_NOT_EMPTY()),
                Field('time', requires=IS_NOT_EMPTY()),
                Field('location', requires=IS_NOT_EMPTY()),
            )

db.commit()
