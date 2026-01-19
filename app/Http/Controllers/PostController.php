<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
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

        return Inertia::render('posts/index', [
            'posts' => [
                'data' => $posts->items(),
                'meta' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'total' => $posts->total(),
                ],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('posts/create');
    }

    public function store(StorePostRequest $request)
    {
        $validated = $request->validated();
        Carbon::parse($validated['published_at'])->format('Y-m-d H:i:s');

        $post = $request->user()->posts()->create($validated);

        return redirect()->route('posts.show', $post)->with('message', 'Post created successfully');
    }

    public function show(Post $post)
    {
        return Inertia::render('posts/show', [
            'post' => $post->load('author'),
        ]);
    }

    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        return Inertia::render('posts/edit', [
            'post' => $post,
        ]);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validated();

        $post->update($validated);

        return redirect()->route('posts.show', $post)->with('message', 'Post updated successfully');
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('posts.index')->with('message', 'Post deleted successfully');
    }
}
