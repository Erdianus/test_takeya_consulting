import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    content: string;
    is_draft: boolean;
    published_at: string | null;
    author: {
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface PageProps {
    post: Post;
}

export default function ShowPost() {
    const { post } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Posts',
            href: '/posts',
        },
        {
            title: post.title,
            href: `/posts/${post.id}`,
        },
    ];

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/posts">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
                            <p className="text-muted-foreground text-sm">By {post.author.name}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/posts/${post.id}/edit`}>
                            <Button variant="outline" className="gap-2">
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Link href={`/posts/${post.id}`} method="delete" as="button">
                            <Button variant="outline" className="text-destructive hover:text-destructive gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant={post.is_draft ? 'secondary' : 'default'}>{post.is_draft ? 'Draft' : 'Published'}</Badge>
                            {post.published_at && (
                                <span className="text-muted-foreground text-sm">Published on {formattedDate(post.published_at)}</span>
                            )}
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <div className="text-foreground whitespace-pre-wrap">{post.content}</div>
                        </div>

                        <div className="text-muted-foreground space-y-2 border-t pt-4 text-sm">
                            <p>Created: {formattedDate(post.created_at)}</p>
                            <p>Last updated: {formattedDate(post.updated_at)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
