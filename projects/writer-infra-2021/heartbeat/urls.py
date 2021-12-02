# -*- coding: utf-8 -*-
from django.urls import re_path

from . import views

urlpatterns = [
    re_path(r'^$', views.heartbeat),
    re_path(r'^redis', views.redis_health),
]
