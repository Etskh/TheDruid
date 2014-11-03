from django.conf.urls import patterns, url

from gfx import views

urlpatterns = patterns('',
	url(r'^mesh/(?P<mesh_id>\d+)$', views.get_mesh, name='get_mesh')
)



