<?php

namespace App\Http\Controllers;

use App\Http\Requests\ActualizarCategoriaRequest;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorias = Categoria::all();
        return CategoriaResource::collection($categorias);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
            'descripcion' => 'nullable|string',
            'color'=> 'nullable|string',
        ]);
        $categoria = new Categoria();
        $categoria->nombre = ucfirst($request->nombre);
        $categoria->slug = Str::slug($request->nombre);
        $categoria->descripcion = $request->descripcion;
        $categoria->color= $request->color;
        $categoria->save();

        return response()->json($categoria, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ActualizarCategoriaRequest $request)
    {   
        $categoria = Categoria::findOrFail($request->id);
        $categoria->update($request->all());
        return new CategoriaResource($categoria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        Categoria::findOrFail($id)->destroy;
        return response()->json('Se borro la categoria correctamente', 201);
    }
}
