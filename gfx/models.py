from django.db import models

class Mesh(models.Model):
	tag = models.CharField(max_length=64)
	
	mesh= models.File()

	def __str__(self):
		return self.tag



class Texture(models.Model):
	tag = models.CharField(max_length=64)
	
	texture= models.File()

	def __str__(self):
		return self.tag


class Material(models.Model):
	tag = models.CharField(max_length=64)
	
	material= models.File()

	def __str__(self):
		return self.tag





