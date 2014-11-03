from django.db import models





class Mesh(models.Model):
	tag = models.CharField(max_length=64)
	mesh = models.FileField(upload_to=get_upload_place)

	def get_upload_place(instance, filename):
        filename, fileExtension = os.path.splitext(filename)
        return 'gfx/static/gfx/mesh/' + str(instance.kid) + fileExtension
	
	def __str__(self):
		return self.tag





class Texture(models.Model):
	tag = models.CharField(max_length=64)
	texture = models.FileField(upload_to=get_upload_place)

	def get_upload_place(instance, filename):
        filename, fileExtension = os.path.splitext(filename)
        return 'gfx/static/gfx/texture/' + str(instance.kid) + fileExtension
	
	def __str__(self):
		return self.tag





class Material(models.Model):
	name = models.CharField(max_length=64)

	def __str__(self):
		return self.name







class Model(models.Model):
	mesh = models.ForeignKey('Mesh', related_name='+')
	material = models.ForeignKey('Material', related_name='+'))
	
	def __str__(self):
		return self.mesh.tag + "-" + self.material.name	
	
	




