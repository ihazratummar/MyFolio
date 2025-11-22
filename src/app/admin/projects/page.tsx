"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

interface Project {
    _id: string;
    title: string;
    category: string;
    image: string;
}

export default function ProjectsAdmin() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProjects(projects.filter((p) => p._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">Projects</h1>
                <Link href="/admin/projects/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project._id} className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden group">
                        <div className="h-48 bg-muted relative">
                            {/* Placeholder for image */}
                            <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-muted-foreground">
                                {project.image ? (
                                    <div className="w-full h-full bg-gray-800" />
                                ) : "No Image"}
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-start">
                                <span className="truncate">{project.title}</span>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">{project.category}</p>
                        </CardHeader>
                        <CardContent className="flex justify-end gap-2">
                            <Link href={`/admin/projects/${project._id}`}>
                                <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(project._id)}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
