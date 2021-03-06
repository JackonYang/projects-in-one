# -*- coding: utf-8 -*-
from django.urls import path, re_path

from . import views

urlpatterns = [
    re_path(r'^$', views.task_home, name='task_home'),
    path(r'app/<str:orig_app_name>', views.app_home, name='app_home'),
    path(r'copy/<str:orig_app_name>', views.copy_home, name='copy_home'),
    path(r'run', views.task_run, name='task_run'),
    path(r'in-progress/<str:orig_app_name>/<int:task_id>', views.in_progress, name='in_progress'),
    path(r'result/<str:orig_app_name>/<int:task_id>', views.task_result, name='task_result'),
    path(r'tasks/<int:task_id>', views.task_detail, name='task_detail'),
    path(r'fetch-notifys/<int:task_id>', views.fetch_notifys, name='fetch_notifys'),
]
