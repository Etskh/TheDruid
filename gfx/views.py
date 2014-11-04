from django.shortcuts import render, get_object_or_404


def get_mesh( request, mesh_id):
	return HttpResponse("You're looking at mesh %s." % mesh_id )

def get_texture( request, texture_id):
	return HttpResponse("You're looking at texture %s." % texture_id )

def get_material( request, material_id):
	return HttpResponse("You're looking at material %s." % material_id )

def get_shader( request, material_id):
	return HttpResponse("You're looking at shader %s." % shader_id )

