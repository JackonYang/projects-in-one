from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'simple-v1', views.simple_v1),
]
