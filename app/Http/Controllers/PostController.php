<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $posts = Post::with('author')
            ->latest()
            ->paginate(20);
        // dd($posts);

        return response()->json([
            'posts' => $posts,
        ]);
    }

    public function create()
    {
        return Inertia::render('posts/create');
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();
        $validated['published_at'] = Carbon::parse($validated['published_at'])->format('Y-m-d H:i:s');
        DB::beginTransaction();
        try {
            $post = $request->user()->posts()->create($validated);
            DB::commit();

            return response()->json([
                'message' => 'Post created successfully',
                'post' => $post->load('author'),
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to create post',
                'error' => $th->getMessage(),
            ], 500);
        }

        // return redirect()->route('posts.show', $post)->with('message', 'Post created successfully');
    }

    public function show(Post $post)
    {
        if (
            is_null($post->published_at) ||
            $post->published_at->isFuture()
        ) {
            abort(404);
        }

        return response()->json([
            'post' => $post->load('author'),
        ]);
    }

    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        return response()->json([
            'post' => $post,
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validated();

        $post->update($validated);

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post,
        ]);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully',
        ], 204);
    }
}
