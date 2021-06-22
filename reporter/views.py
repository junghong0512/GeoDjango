from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import Gangnam, Incidences

# Create your views here.
class HomePageView(TemplateView):
    template_name = 'index.html'


def gangnam_datasets(request):
    gangnams = serialize('geojson', Gangnam.objects.all())
    return HttpResponse(gangnams, content_type='json')


def points_datasets(request):
    points = serialize('geojson', Incidences.objects.all())
    return HttpResponse(points, content_type='json')