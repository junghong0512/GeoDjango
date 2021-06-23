from django.contrib import admin
from .models import Incidences, Gangnam, Building
from leaflet.admin import LeafletGeoAdmin

# Register your models here.

class IncedencesAdmin(LeafletGeoAdmin):
    #pass
    list_display = ('name', 'location')

class GangnamAdmin(LeafletGeoAdmin):
    #pass
    list_display = ('pnu', 'jibun')

class BuildingAdmin(LeafletGeoAdmin):
    #pass
    list_display = ('geom',)

admin.site.register(Incidences, IncedencesAdmin)
admin.site.register(Gangnam, GangnamAdmin)
admin.site.register(Building, BuildingAdmin)