from django.shortcuts import render
from django.views.generic import TemplateView
from django.core.serializers import serialize
from django.http import HttpResponse
from .models import Gangnam

# Create your views here.
class HomePageView(TemplateView):
    template_name = 'index.html'


def gangnam_datasets(request):
    gangnam = serialize('geojson', Gangnam.objects.all())
    return HttpResponse(gangnam, content_type='json')