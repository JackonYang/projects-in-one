from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'list', views.message_list),
    url(r'user-chats', views.get_user_chats),
    # url(r'friend-requests', views.chats),
]
