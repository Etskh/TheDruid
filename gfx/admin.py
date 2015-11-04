from django.contrib import admin
from django import forms
from gfx.models import Mesh, Texture, Material, Shader, ShaderVariable, Model


#class ShaderModelForm( forms.ModelForm ):
#    shader = forms.CharField( widget=forms.Textarea )
#    class Meta:
#        model = Shader

class ShaderAdmin(admin.ModelAdmin):
	#form = ShaderModelForm
	class Media:
		css = {
			"all": ("extern/codemirror-4.7/lib/codemirror.css",)
		}
		js = (
			"extern/codemirror-4.7/lib/codemirror.js",
			"extern/codemirror-4.7/mode/clike/clike.js",
			"gfx/admin/gfx.js"
		)


admin.site.register( Mesh )
admin.site.register( Texture )
admin.site.register( Material )
admin.site.register( Shader, ShaderAdmin)
admin.site.register( ShaderVariable )
admin.site.register( Model )
