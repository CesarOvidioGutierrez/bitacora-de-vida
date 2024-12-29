#!/bin/bash

set -o errexit  
set -o pipefail  
set -o nounset

# gunicorn -c /app/gunicorn.conf.py  --graceful-timeout 7200 --keep-alive 7200 satdbmng.wsgi:application

# Ejecutar migraciones
python manage.py migrate --noinput

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

gunicorn bitacora_de_vida.wsgi:application --bind 0.0.0.0:8000 --reload