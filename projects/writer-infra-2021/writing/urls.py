# -*- coding: utf-8 -*-
from django.urls import path, re_path

from . import views

urlpatterns = [
    re_path(r'^$', views.task_home, name='task_home'),
    path(r'app/<str:orig_app_name>', views.task_home_v2, name='task_home_v2'),
    re_path(r'^run-v2$', views.task_run_v2, name='task_run_v2'),
    re_path(r'^demo$', views.demo_home, name='demo_home'),
    re_path(r'^run$', views.task_run, name='task_run'),
    re_path(r'^demo-run$', views.demo_run, name='demo_run'),
    path(r'in-progress/<int:task_id>', views.in_progress, name='in_progress'),
    path(r'tasks/<int:task_id>', views.task_detail, name='task_detail'),
    path(r'result/<int:task_id>', views.demo_result, name='demo_result'),
    path(r'load-tmpl/<int:tmpl_id>', views.load_tmpl, name='load_tmpl'),
    path(r'fetch-notifys/<int:task_id>', views.fetch_notifys, name='fetch_notifys'),
]
