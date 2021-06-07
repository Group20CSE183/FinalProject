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

def get_user():
    return auth.current_user.get('id') if auth.current_user else None

### Define your table below
#
# db.define_table('thing', Field('name'))
#
## always commit your models to avoid problems later

db.define_table('posts',
                Field('user_email', default=get_user_email),
                Field('poster', 'reference auth_user', default=get_user),
                Field('text', requires=IS_NOT_EMPTY()),
                Field('date', requires=IS_NOT_EMPTY()),
                Field('time', requires=IS_NOT_EMPTY()),
                Field('location', requires=IS_NOT_EMPTY()),
                Field('name'),
                Field('going', type='integer',default='0'),
                Field('tag1'),
                Field('tag2'),
                Field('tag3'),
                Field('going_list', type='list:string'),
                Field('thumbnail','text'),
            )

db.commit()
