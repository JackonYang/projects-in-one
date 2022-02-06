# -*- coding: utf-8 -*-
from django.urls import path

from . import views

urlpatterns = [
    path(r'submit-task', views.submit_task, name='dl_submit_task'),
    path(r'get-result/<int:task_id>', views.get_result, name='dl_get_result'),
]
