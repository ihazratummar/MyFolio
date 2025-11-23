"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ProjectForm({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isEditing = !!params.id;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Mobile Apps",
        tags: "",
        images: [] as string[],
        liveUrl: "",
        githubUrl: "",
        id: 0, // Custom ID for ordering
    });
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        if (isEditing) {
            fetchProject();
        }
    }, [isEditing]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${params.id}`);
            const data = await res.json();
            setFormData({
                ...data,
                tags: data.tags.join(", "), // Convert array to comma-separated string
                images: data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []),
            });
            // Fetch comments using the MongoDB _id from the project data
            fetchComments(data._id);
        } catch (error) {
            console.error("Failed to fetch project", error);
        }
    };

    const fetchComments = async (projectId: string) => {
        try {
            const res = await fetch(`/api/comments?projectId=${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setComments(comments.filter((c) => c._id !== commentId));
            }
        } catch (error) {
            console.error("Failed to delete comment", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ""] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            tags: formData.tags.split(",").map((tag) => tag.trim()), // Convert string back to array
            id: Number(formData.id),
        };

        try {
            const url = isEditing ? `/api/projects/${params.id}` : "/api/projects";
            const method = isEditing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push("/admin/projects");
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to save project", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/projects">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold font-heading">
                    {isEditing ? "Edit Project" : "New Project"}
                </h1>
            </div>

            <Card className="bg-card/50 backdrop-blur-sm border-white/10">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="Mobile Apps">Mobile Apps</option>
                                    <option value="Discord Bots">Discord Bots</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Web Development">Web Development</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Order ID (Number)</label>
                                <Input
                                    type="number"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image URLs</label>
                                {formData.images.map((img, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={img}
                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                            placeholder={`/project-image-${index + 1}.jpg`}
                                            className="bg-white/5 border-white/10"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeImageField(index)}
                                        >
                                            <span className="sr-only">Remove</span>
                                            &times;
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={addImageField} className="mt-2">
                                    + Add Image URL
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Live URL</label>
                                <Input
                                    name="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">GitHub URL</label>
                                <Input
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="bg-white/5 border-white/10 min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (comma separated)</label>
                            <Input
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="React, Node.js, TypeScript"
                                className="bg-white/5 border-white/10"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white">
                                <Save className="w-4 h-4 mr-2" />
                                {loading ? "Saving..." : "Save Project"}
                            </Button>
                        </div>
                    </form>

                    {isEditing && (
                        <div className="mt-12 border-t border-white/10 pt-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Manage Comments
                            </h3>
                            <div className="space-y-4">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment._id} className="bg-white/5 p-4 rounded-lg flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-primary">{comment.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-300">{comment.content}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No comments yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
