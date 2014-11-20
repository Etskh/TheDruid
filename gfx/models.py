from django.db import models
import os
import uuid








class Mesh(models.Model):
	class Meta:
		verbose_name = "mesh"
		verbose_name_plural = "meshes"

	def get_upload_place(instance, filename):
		filename, fileExtension = os.path.splitext(filename)
		randomID = uuid.uuid4()
		return 'gfx/static/gfx/mesh/' + randomID.hex + fileExtension
	
	tag = models.CharField(max_length=64)
	mesh = models.FileField(upload_to=get_upload_place)
	
	def __str__(self):
		return self.tag







class Texture(models.Model):
	def get_upload_place(instance, filename):
		filename, fileExtension = os.path.splitext(filename)
		randomID = uuid.uuid4()
		return 'gfx/static/gfx/texture/' + randomID.hex + fileExtension
	
	tag = models.CharField(max_length=64)
	texture = models.FileField(upload_to=get_upload_place)
	
	def __str__(self):
		return self.tag







class ShaderVariable(models.Model):
	Types = (
		( 0, 'Float'),
		( 1, 'Vector2'),
		( 2, 'Vector3'),
		( 3, 'Vector4'),
		( 4, 'Matrix3'),
		( 5, 'Matrix4'),
		( 6, 'Colour'),
		( 7, 'Texture'),
	)

	tag = models.CharField(max_length=64)
	type = models.IntegerField( choices=Types )
	
	def __str__(self):
		return self.tag








class Shader(models.Model):
	Types = (
		( 0, 'Vertex'),
		( 1, 'Fragment'),
		( 2, 'Geometry'),
		( 3, 'Tessellation'),
	)
	
	tag = models.CharField(max_length=64)
	type = models.IntegerField(choices=Types)
	shader = models.TextField()
	variables = models.ManyToManyField(ShaderVariable, blank=True)
	
	def __str__(self):
		return "{0} ({1})".format( self.tag, Shader.Types[ self.type ][1] )









class Material(models.Model):
	name = models.CharField(max_length=64)
	shaders = models.ManyToManyField(Shader)
	uniforms= models.ManyToManyField(ShaderVariable)
	
	def getVertex(self):
		shader = self.shaders.filter( type=0 )
		try:
			return shader[0].shader
		except IndexError:
			return ''
	
	def getFragment(self):
		shader = self.shaders.filter( type=1 )
		try:
			return shader[0].shader
		except IndexError:
			return ''
	
	def getGeometry(self):
		shader = self.shaders.filter( type=2 )
		try:
			return shader[0].shader
		except IndexError:
			return ''
	
	def getTessellation(self):
		shader = self.shaders.filter( type=3 )
		try:
			return shader[0].shader
		except IndexError:
			return ''
	
	def __str__(self):
		return self.name







class Model(models.Model):

	name = models.CharField( max_length=64 )
	mesh = models.ForeignKey('Mesh', related_name='+')
	material = models.ForeignKey('Material', related_name='+')
	
	def __str__(self):
		return "{0}({1}-{2})".format( self.name, self.mesh.tag, self.material.name )
	


