from django.contrib import admin
from gfx.models import Mesh, Texture, Material


admin.Register( Mesh )
admin.Register( Texture )
admin.Register( Material )


