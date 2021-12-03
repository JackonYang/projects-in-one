# -*- coding: utf-8 -*-
from django.urls import path, re_path

from . import views

urlpatterns = [
    re_path(r'^$', views.task_home, name='task_home'),
    re_path(r'^run$', views.task_run, name='task_run'),
    path(r'tasks/<int:task_id>', views.task_detail, name='task_detail'),
    path(r'load-tmpl/<int:tmpl_id>', views.load_tmpl, name='load_tmpl'),
    path(r'fetch-notifys', views.fetch_notifys, name='fetch_notifys'),
]
