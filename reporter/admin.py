from django.contrib import admin
from .models import Incidences
from leaflet.admin import LeafletGeoAdmin

# Register your models here.

class IncedencesAdmin(LeafletGeoAdmin):
    list_display = ('name', 'location')

admin.site.register(Incidences, IncedencesAdmin) 