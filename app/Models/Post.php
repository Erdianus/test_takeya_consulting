<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'published_at',
        'is_draft',
        'user_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_draft' => 'boolean',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Active (published) posts only
     */
    public function scopeActive($query)
    {
        return $query
            ->where('is_draft', false)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
