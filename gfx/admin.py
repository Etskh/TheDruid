from django.contrib import admin
from gfx.models import Mesh, Texture, Material, Shader, ShaderVariable

class ShaderAdmin(admin.ModelAdmin):
	class Media:
		css = {
			"all": ("gfx/extern/codemirror-4.7/lib/codemirror.css",)
		}
		js = (
			"gfx/extern/codemirror-4.7/lib/codemirror.js",
			"gfx/extern/codemirror-4.7/mode/clike/clike.js",
			"gfx/admin/gfx.js"
		)


admin.site.register( Mesh )
admin.site.register( Texture )
admin.site.register( Material )
admin.site.register( Shader, ShaderAdmin)
admin.site.register( ShaderVariable )

