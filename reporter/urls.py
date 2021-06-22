from django.conf.urls import include, url
from django.urls import re_path

from reporter.views import HomePageView, gangnam_datasets, points_datasets

urlpatterns = [
    re_path(r'^$', HomePageView.as_view(), name='home'),
    re_path(r'^gangnam_data/$', gangnam_datasets, name='gangnam'),
    re_path(r'^incidence_data/$', points_datasets, name='incidences'),
]
