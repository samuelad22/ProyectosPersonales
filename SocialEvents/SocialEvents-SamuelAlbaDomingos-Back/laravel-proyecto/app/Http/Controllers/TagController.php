<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagResource;
use App\Models\Categoria;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Symfony\Component\Translation\Catalogue\TargetOperation;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TagResource::collection(Tag::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:tags,nombre',
            'categorias' => 'nullable|array',
            'categorias.*' => 'string|exists:tags,nombre',
        ]);
        $tag = new Tag();
        $tag->nombre = $request->nombre;
        $tag->slug = Str::slug($request->nombre);
        $tag->save();

        if ($request->filled('categorias')) {
            $tagIds = Tag::whereIn('nombre', $request->categorias)->pluck('id');
            $tag->categorias()->attach($tagIds);
        }

        return response()->json($tag, 201);
    }

    public function listarTags()
    {
        $tags = Tag::paginate(27);

        return response()->json([
            'data' => [
                'tags' => TagResource::collection($tags),
                'hayMas' => $tags->hasMorePages(),
                'paginaAnterior' => $tags->currentPage() - 1,
                'paginaActual'               => $tags->currentPage(),
            ]
        ]);
    }
    public function buscarTagsPorNombre(Request $request)
    {
        $tags = Tag::where('nombre', 'LIKE', '%' . $request->nombre . '%')->paginate(27);
        return TagResource::collection($tags);
    }
    public function recomendarTag(Request $request)
    {
        $tag = Tag::where('nombre', 'LIKE', $request->nombre . '%')->first();
        if (!$tag)
            return response()->json(["mensaje" => "No se encontro la etiqueta"], 400);
        return new TagResource($tag);
    }
    public function update(Request $request)
    {
        $request->validate([
            "nombre" => 'required|string|min:1',
            "id" => 'required|numeric'
        ]);
        $tag = Tag::find($request->id);
        $tag->nombre = ucfirst($request->nombre);
        $tag->slug = Str::slug($request->nombre);
        $tag->save();
        return response()->json(["mensaje" => "se actualizo el nombre de la etiqueta"], 201);
    }

    public function destroy(Request $request)
    {
        Tag::findOrFail($request->tag_id)->delete();
        return response()->json('Se borro la tag correctamente', 201);
    }
}
