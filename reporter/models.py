from django.db import models
from django.contrib.gis.db import models
from django.db.models import Manager as GeoManager

# Create your models here.
class Incidences(models.Model):
    name = models.CharField(max_length=20)
    location = models.PointField(srid=4326)
    objects = GeoManager()

    def __unicode__(self):
        return self.name

    class Meta:
        verbose_name_plural = " Incidences"


class Gangnam(models.Model):
    pnu = models.CharField(max_length=19)
    jibun = models.CharField(max_length=15)
    bchk = models.CharField(max_length=1)
    sgg_oid = models.BigIntegerField()
    col_adm_se = models.CharField(max_length=5)
    geom = models.MultiPolygonField(srid=4326, null=True, geography=True)

    def __unicode__(self):
        return self.gangnam


class Building(models.Model):
    geom = models.MultiPolygonField(srid=4326, null=True, geography=True)

    def __unicode__(self):
        return self.building