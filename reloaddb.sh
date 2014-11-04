#!/bin/sh

python manage.py dumpdata gfx > gfx/fixtures/gfx.json
rm db.sqlite3
python manage.py syncdb


