from django.shortcuts import render
from gfx.models import Material
from django.template import RequestContext

def home( request ):
	rc = RequestContext(request)
	return render( request, 'Druid/index.html', context_instance=rc )