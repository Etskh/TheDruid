from django.conf.urls import patterns, url

from gfx import views

urlpatterns = patterns('',
	url(r'^mesh/([0-9]+)$', views.get_mesh, name='get_mesh'),
	url(r'^texture/([0-9]+)$', views.get_texture, name='get_texture'),
	url(r'^material/([0-9]+)$', views.get_material, name='get_material'),
	url(r'^shader/([0-9]+)$', views.get_shader, name='get_shader'),
	url(r'^models/search$', views.search_models, name='search_models'),
)



