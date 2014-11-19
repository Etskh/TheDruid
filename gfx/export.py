"""
	export.js

	Exports a mesh from any filepath to a similarly named file (except its extension
	reflects the type. Right now, it exports a .js file for use with ThreeJS.
	
	Author: James Loucks
	Date: November 2014
"""
import bpy
import os
import inspect


filename, fileExtension = os.path.splitext(bpy.data.filepath)

def MeshToPart(mesh, accuracy=5):
	" This exports a mesh "
	
	positions = ''
	normals = ''
	
	for vert in mesh.vertices:
		positions+= """{0},{1},{2},""".format(
			round(vert.co[0], accuracy),
			round(vert.co[1], accuracy),
			round(vert.co[2], accuracy)
		)
		normals+= """{0},{1},{2},""".format(
			round(vert.normal[0], accuracy),
			round(vert.normal[1], accuracy),
			round(vert.normal[2], accuracy)
		)
		#print( inspect.getmembers(vert) )
	
	return """{{
		"metadata": {{
			"version": 4,
			"type": "BufferGeometry",
			"generator": "Custom-Exporter"
		}},
		"attributes" : {{
			"position": {{
				"itemSize": 3,
				"type": "Float32Array",
				"array": [{0}]
			}},
			"normals" : {{
				"itemSize": 3,
				"type": "Float32Array",
				"array": [{1}]
			}}
		}}
	}}""".format(
		positions[:-1],
		normals[:-1]
	)


newFile = open("{0}.js".format(filename), 'w')

for ob in bpy.data.meshes:
	print("Exporting {0}".format( ob.name ))
	newFile.write( MeshToPart(ob) )
	
newFile.close()