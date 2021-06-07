"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)

@action('index')
@action.uses(db, auth.user, url_signer, 'index.html')
def index():
    return dict(
        # COMPLETE: return here any signed URLs you need.
        my_callback_url = URL('my_callback', signer=url_signer),
        load_posts_url = URL('load_posts', signer=url_signer),
        add_post_url = URL('add_post', signer=url_signer),
        add_tags_url = URL('add_tags', signer=url_signer),
        add_post_tag_url = URL('add_post_tag', signer=url_signer),
        delete_post_url = URL('delete_post', signer=url_signer),
        user_email = get_user_email(),
        username = auth.current_user.get('first_name') + " " + auth.current_user.get("last_name"),
        get_going_url = URL('get_going', signer=url_signer),
        update_going_url = URL('update_going', signer=url_signer),
        update_not_going_url = URL('update_not_going', signer=url_signer),
        upload_thumbnail_url = URL('upload_thumbnail', signer=url_signer),
    )

@action('load_posts')
@action.uses(url_signer.verify(), db)
def load_posts():
    rows = db(db.posts).select().as_list()
    rows.reverse()
    current_user_email = get_user_email()
    current_user_row = db(db.auth_user.email == current_user_email).select().first()
    return dict(rows=rows,
    current_user_id=current_user_row.id, current_user_email=current_user_email)

@action('add_post', method="POST")
@action.uses(url_signer.verify(), db)
def add_post():
    user_id = get_user_email()
    r = db(db.auth_user.email == user_id).select().first()
    name = r.first_name + " " + r.last_name if r is not None else "Unknown"
    id = db.posts.insert(
        text=request.json.get('text'),
        name=name,
        date=request.json.get('date'),
        time=request.json.get('time'),
        location=request.json.get('location'),
        max_going=request.json.get('max_going'),
        tag1=request.json.get('tag1'),
        tag2=request.json.get('tag2'),
        tag3=request.json.get('tag3'),
        going=request.json.get('going'),
        going_list=[],
    )
    return dict(id=id,
    name=name,)

@action('delete_post')
@action.uses(url_signer.verify(), db)
def delete_post():
    id = request.params.get('id')
    assert id is not None
    db(db.posts.id == id).delete()

@action('add_tags', method="POST")
@action.uses(url_signer.verify(), db)
def add_tags():
    print("called add tags")
    id = db.tags.insert(
        tag1=request.json.get('tag1'),
        tag2=request.json.get('tag2'),
        tag3=request.json.get('tag3'),
    )
    return dict(id=id)

# runs this if someone clicks going button
@action('update_going')
@action.uses(url_signer.verify(), db)
def update_going():
    id = request.params.get('id')
    assert id is not None
    row=db(db.posts.id == id).select().first()
    b=row.going_list
    
    # going
    # either in going_list already, do nothing
    # or add to going_list
    if get_user_email() not in b:
        if len(b) < row.max_going:
            b.append(get_user_email())
            db(db.posts.id == id).update(
                going=row.going+1
            )

    db(db.posts.id == id).update(
             going_list = b
         )
    
    return dict(num_going=len(b))

@action('update_not_going')
@action.uses(url_signer.verify(), db)
def update_not_going():
    id = request.params.get('id')
    assert id is not None
    row=db(db.posts.id == id).select().first()
    b=row.going_list

    if get_user_email() in b:
        # going button was already pressed
        # remove user email from going_list
        # not going
        db(db.posts.id == id).update(
            going=row.going-1
        )
        b.remove(get_user_email())

    db(db.posts.id == id).update(
             going_list = b
         )
    
    return dict(num_going=len(b))

@action('upload_thumbnail', method="POST")
@action.uses(url_signer.verify(), db)
def upload_thumbnail():
    id = request.json.get("id")
    thumbnail = request.json.get("thumbnail")
    db(db.posts.id == id).update(thumbnail=thumbnail)