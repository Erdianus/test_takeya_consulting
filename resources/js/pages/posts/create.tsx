import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
    {
        title: 'Create',
        href: '/posts/create',
    },
];

export default function CreatePost() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        is_draft: true,
        published_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/posts', {
            onSuccess: () => {
                // Redirect will be handled by Laravel
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <a href="/posts" className="inline-block">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </a>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
                        <p className="text-muted-foreground text-sm">Create a new blog post</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card rounded-lg border p-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Enter post title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={errors.title ? 'border-destructive' : ''}
                                />
                                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Enter post content"
                                    rows={10}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className={errors.content ? 'border-destructive' : ''}
                                />
                                {errors.content && <p className="text-destructive text-sm">{errors.content}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="published_at">Published Date (optional)</Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className={errors.published_at ? 'border-destructive' : ''}
                                />
                                {errors.published_at && <p className="text-destructive text-sm">{errors.published_at}</p>}
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox id="is_draft" checked={data.is_draft} onCheckedChange={(checked) => setData('is_draft', !!checked)} />
                                <Label htmlFor="is_draft" className="cursor-pointer">
                                    Save as Draft
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Post'}
                        </Button>
                        <a href="/posts">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
