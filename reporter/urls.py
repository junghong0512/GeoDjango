from django.conf.urls import include, url
from django.urls import re_path

from agricom.settings import MAPBOX_KEY
from reporter.views import HomePageView, SubPageView, TestPageView, gangnam_datasets, points_datasets, building_datasets


urlpatterns = [
    re_path(r'^$', HomePageView.as_view(), {
        'mapbox_key': MAPBOX_KEY,
    }, name='home'),
    re_path(r'^subpage/$', SubPageView.as_view(), {
        'mapbox_key': MAPBOX_KEY,
    }, name='subpage'),
    re_path(r'^testpage/$', TestPageView.as_view(), {
        'mapbox_key': MAPBOX_KEY,
    }, name='testpage'),
    re_path(r'^gangnam_data/$', gangnam_datasets, name='gangnam'),
    re_path(r'^incidence_data/$', points_datasets, name='incidences'),
    re_path(r'^building_data/$', building_datasets, name='buildings'),
]
