"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Social {
    _id: string;
    name: string;
    href: string;
    icon: string;
}

export default function SocialsAdmin() {
    const [socials, setSocials] = useState<Social[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentSocial, setCurrentSocial] = useState<Partial<Social>>({});

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const res = await fetch("/api/socials");
            const data = await res.json();
            setSocials(data);
        } catch (error) {
            console.error("Failed to fetch socials", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this social link?")) return;

        try {
            const res = await fetch(`/api/socials`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setSocials(socials.filter((s) => s._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete social link", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = currentSocial._id ? "PUT" : "POST";
            const res = await fetch("/api/socials", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentSocial),
            });

            if (res.ok) {
                fetchSocials();
                setIsDialogOpen(false);
                setCurrentSocial({});
            }
        } catch (error) {
            console.error("Failed to save social link", error);
        }
    };

    const openEditDialog = (social: Social) => {
        setCurrentSocial(social);
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setCurrentSocial({});
        setIsDialogOpen(true);
    };

    const renderIcon = (iconName: string) => {
        const Icon = (LucideIcons as any)[iconName];
        return Icon ? <Icon className="w-5 h-5" /> : <LucideIcons.Share2 className="w-5 h-5" />;
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">Social Links</h1>
                <Button onClick={openNewDialog} className="bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socials.map((social) => (
                    <Card key={social._id} className="bg-card/50 backdrop-blur-sm border-white/10 group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    {renderIcon(social.icon)}
                                </div>
                                <span className="truncate">{social.name}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4 truncate">{social.href}</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(social)} className="border-white/10 hover:bg-white/5">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(social._id)}
                                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-background/95 backdrop-blur-2xl border-white/10">
                    <DialogHeader>
                        <DialogTitle>{currentSocial._id ? "Edit Social Link" : "New Social Link"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Platform Name</label>
                            <Input
                                value={currentSocial.name || ""}
                                onChange={(e) => setCurrentSocial({ ...currentSocial, name: e.target.value })}
                                placeholder="GitHub, LinkedIn, Twitter"
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL</label>
                            <Input
                                value={currentSocial.href || ""}
                                onChange={(e) => setCurrentSocial({ ...currentSocial, href: e.target.value })}
                                placeholder="https://..."
                                required
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Icon (Lucide Name)</label>
                            <Input
                                value={currentSocial.icon || ""}
                                onChange={(e) => setCurrentSocial({ ...currentSocial, icon: e.target.value })}
                                placeholder="Github, Linkedin, Twitter"
                                required
                                className="bg-white/5 border-white/10"
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the exact name of the Lucide icon (e.g., "Github", "Twitter", "Linkedin").
                            </p>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-primary text-white">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
