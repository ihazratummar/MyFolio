"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink, Smartphone } from "lucide-react";

interface Project {
    id: number;
    title: string;
    description: string;
    tags: string[];
    category: string;
    image: string;
    liveUrl: string;
    githubUrl: string;
}

export const Projects = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const categories = ["All", "Mobile Apps", "Discord Bots", "Backend"];

    const filteredProjects = activeTab === "All"
        ? projects
        : projects.filter(project => project.category === activeTab);

    if (loading) {
        return <div className="py-20 text-center">Loading projects...</div>;
    }

    return (
        <section id="projects" className="py-20 bg-black/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
                        Featured <span className="text-secondary">Projects</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                        A selection of my best work, ranging from automation systems to mobile applications.
                    </p>

                    <Tabs defaultValue="All" className="w-full max-w-3xl mx-auto" onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/5 p-1 rounded-xl">
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category}
                                    value={category}
                                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all duration-300"
                                >
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </motion.div>

                <motion.div
                    layout
                    className="grid grid-rows-2 grid-flow-col gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 auto-cols-[300px] md:auto-cols-[350px]"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="snap-center h-full"
                            >
                                <Card className="bg-card/50 backdrop-blur-sm border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 group h-full flex flex-col">
                                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                                        {/* Placeholder for project image if not available */}
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-white/5">
                                            {project.image ? (
                                                // In a real scenario, use Next.js Image. For now, just a placeholder div if image path is dummy
                                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                                <Button size="icon" variant="secondary" className="rounded-full">
                                                    <Github className="w-5 h-5" />
                                                </Button>
                                            </a>
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                                <Button size="icon" className="rounded-full bg-primary text-white hover:bg-primary/90">
                                                    {project.liveUrl && project.liveUrl.includes("play.google.com") ? (
                                                        <Smartphone className="w-5 h-5" />
                                                    ) : (
                                                        <ExternalLink className="w-5 h-5" />
                                                    )}
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map((tag, i) => (
                                                <Badge key={i} variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};
