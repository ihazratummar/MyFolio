"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { uploadFromUrl, getPresignedUrl, completeUpload, deleteFile } from "@/app/actions/upload";

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
        imageKeys: [] as string[],
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
                imageKeys: data.imageKeys || [],
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

    const handleImageChange = (index: number, value: string, key?: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;

        const newKeys = [...formData.imageKeys];
        if (key) {
            newKeys[index] = key;
        }

        setFormData({ ...formData, images: newImages, imageKeys: newKeys });
    };

    const addImageField = () => {
        setFormData({
            ...formData,
            images: [...formData.images, ""],
            imageKeys: [...formData.imageKeys, ""]
        });
    };

    const removeImageField = async (index: number) => {
        const imageKey = formData.imageKeys[index];
        if (imageKey) {
            if (confirm("Are you sure you want to remove this image? It will be deleted from storage.")) {
                try {
                    await deleteFile(imageKey);
                } catch (error) {
                    console.error("Failed to delete file from storage", error);
                    alert("Failed to delete file from storage, but removing from list.");
                }
            }
        }

        const newImages = formData.images.filter((_, i) => i !== index);
        const newKeys = formData.imageKeys.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages, imageKeys: newKeys });
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
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Project Images</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="flex flex-col gap-2 p-4 border border-white/10 rounded-lg bg-white/5">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-muted-foreground">Image {index + 1}</span>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => removeImageField(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {img ? (
                                                <div className="flex gap-4 items-center">
                                                    <div className="relative w-24 h-24 bg-black/20 rounded-md overflow-hidden flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow space-y-2">
                                                        <Input
                                                            value={img}
                                                            onChange={(e) => handleImageChange(index, e.target.value)}
                                                            className="bg-white/5 border-white/10 font-mono text-xs"
                                                        />
                                                        <p className="text-xs text-green-400">✓ Image set</p>
                                                        {formData.imageKeys[index] && (
                                                            <p className="text-xs text-muted-foreground">Key: {formData.imageKeys[index]}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex gap-4 border-b border-white/10 pb-2">
                                                        <button
                                                            type="button"
                                                            className="text-sm font-medium text-primary border-b-2 border-primary pb-1"
                                                        >
                                                            Upload / Paste
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Option 1: Paste URL */}
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-muted-foreground">Paste Image URL</label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder="https://example.com/image.jpg"
                                                                    className="bg-white/5 border-white/10"
                                                                    id={`url-input-${index}`}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={async () => {
                                                                        const input = document.getElementById(`url-input-${index}`) as HTMLInputElement;
                                                                        if (!input.value) return;

                                                                        try {
                                                                            setLoading(true);
                                                                            // Note: uploadFromUrl needs to be updated to return object_key too if we want it here immediately
                                                                            // But for now, let's assume it returns just URL or update it.
                                                                            // Wait, I haven't updated uploadFromUrl to return key yet.
                                                                            // I should do that first or handle it here.
                                                                            // Actually, completeUpload returns { object_key, final_url ... }
                                                                            // So uploadFromUrl should return that object.
                                                                            const result = await uploadFromUrl(input.value);
                                                                            // Assuming uploadFromUrl now returns object.
                                                                            // I need to update uploadFromUrl to return object first.
                                                                            // But I can't do that in this tool call.
                                                                            // Let's assume I will update uploadFromUrl to return { final_url, object_key }
                                                                            if (typeof result === 'object') {
                                                                                handleImageChange(index, result.final_url, result.object_key);
                                                                            } else {
                                                                                handleImageChange(index, result);
                                                                            }
                                                                        } catch (err) {
                                                                            alert("Failed to upload from URL");
                                                                            console.error(err);
                                                                        } finally {
                                                                            setLoading(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    Upload
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Option 2: File Upload */}
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-muted-foreground">Or Upload File</label>
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                className="bg-white/5 border-white/10 cursor-pointer"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;

                                                                    try {
                                                                        setLoading(true);
                                                                        // 1. Get Presigned URL
                                                                        const { upload_url, object_key } = await getPresignedUrl(file.type, file.size);

                                                                        // 2. Upload to MinIO
                                                                        await fetch(upload_url, {
                                                                            method: "PUT",
                                                                            headers: { "Content-Type": file.type },
                                                                            body: file,
                                                                        });

                                                                        // 3. Complete Upload
                                                                        const { final_url } = await completeUpload(object_key, file.size, file.type);

                                                                        handleImageChange(index, final_url, object_key);
                                                                    } catch (err) {
                                                                        alert("Failed to upload file");
                                                                        console.error(err);
                                                                    } finally {
                                                                        setLoading(false);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addImageField} className="mt-2 w-full border-dashed">
                                    + Add Another Image
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
