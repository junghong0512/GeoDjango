import os
from django.contrib.gis.utils import LayerMapping
from .models import Gangnam, Building

gangnam_mapping = {
    'pnu': 'pnu',
    'jibun': 'jibun',
    'bchk': 'bchk',
    'sgg_oid': 'sgg_oid',
    'col_adm_se': 'col_adm_se',
    'geom': 'MULTIPOLYGON',
}

gangnam_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data/gangnam.shp'))


building_mapping = {
    'geom': 'MULTIPOLYGON',
}

building_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data/building.shp'))


def run(verbose=True):
    lm = LayerMapping(Gangnam, gangnam_shp, gangnam_mapping, transform=False, encoding='cp949')
    #lm = LayerMapping(Building, building_shp, building_mapping, transform=True, encoding='utf-8')
    lm.save(strict=True, verbose=verbose)