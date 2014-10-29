from django.db import models

class Mesh(models.Model):
	tag = models.CharField(max_length=64)
	
	mesh= models.File()

	def __str__(self):
		return self.tag



