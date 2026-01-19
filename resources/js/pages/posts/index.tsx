import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

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
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    total: number;
}

interface PageProps {
    posts: {
        data: Post[];
        meta: PaginationMeta;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

export default function PostsIndex() {
    const { posts } = usePage<PageProps>().props;

    const formattedDate = useMemo(() => {
        return (date: string) => {
            return new Date(date).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                        <p className="text-muted-foreground text-sm">Manage all your posts</p>
                    </div>
                    <Link href="/posts/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Post
                        </Button>
                    </Link>
                </div>

                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Published Date</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.data.length > 0 ? (
                                posts.data.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>{post.author.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={post.is_draft ? 'secondary' : 'default'}>{post.is_draft ? 'Draft' : 'Published'}</Badge>
                                        </TableCell>
                                        <TableCell>{post.published_at ? formattedDate(post.published_at) : '-'}</TableCell>
                                        <TableCell>{formattedDate(post.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/posts/${post.id}/edit`}>
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/posts/${post.id}`} method="delete" as="button">
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive gap-1">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                                        No posts found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {posts.meta.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            Showing page {posts.meta.current_page} of {posts.meta.last_page}
                        </p>
                        <div className="flex gap-2">
                            {posts.meta.current_page > 1 && (
                                <Link href={`/posts?page=${posts.meta.current_page - 1}`}>
                                    <Button variant="outline">Previous</Button>
                                </Link>
                            )}
                            {posts.meta.current_page < posts.meta.last_page && (
                                <Link href={`/posts?page=${posts.meta.current_page + 1}`}>
                                    <Button variant="outline">Next</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
