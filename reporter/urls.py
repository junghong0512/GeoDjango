from django.conf.urls import include, url
from django.urls import re_path

from reporter.views import HomePageView

urlpatterns = [
    re_path(r'^$', HomePageView.as_view(), name = 'home')
]
