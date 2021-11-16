# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.urls import path

from . import views

urlpatterns = [
    url(r'^$', views.task_home, name='task_home'),
    url(r'^run$', views.task_run, name='task_run'),
    path(r'tasks/<int:task_id>', views.task_detail, name='task_detail'),
    path(r'load-tmpl/<int:tmpl_id>', views.load_tmpl, name='load_tmpl'),
]
