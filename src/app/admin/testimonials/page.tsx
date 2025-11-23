"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    image: string;
}

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial>>({});

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/testimonials");
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const res = await fetch(`/api/testimonials`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setTestimonials(testimonials.filter((t) => t._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete testimonial", error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = currentTestimonial._id ? "PUT" : "POST";
            const res = await fetch("/api/testimonials", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(currentTestimonial),
            });

            if (res.ok) {
                fetchTestimonials();
                setIsDialogOpen(false);
                setCurrentTestimonial({});
            }
        } catch (error) {
            console.error("Failed to save testimonial", error);
        }
    };

    const openEditDialog = (testimonial: Testimonial) => {
        setCurrentTestimonial(testimonial);
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setCurrentTestimonial({ rating: 5 });
        setIsDialogOpen(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold font-heading">Testimonials</h1>
                <Button onClick={openNewDialog} className="bg-primary hover:bg-primary/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                    <Card key={testimonial._id} className="bg-card/50 backdrop-blur-sm border-white/10 group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                    {testimonial.image ? (
                                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="text-base">{testimonial.name}</div>
                                    <div className="text-xs text-muted-foreground">{testimonial.role} @ {testimonial.company}</div>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-1 mb-2 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < (testimonial.rating || 5) ? "fill-current" : "text-muted"}`} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">"{testimonial.content}"</p>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => openEditDialog(testimonial)} className="border-white/10 hover:bg-white/5">
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(testimonial._id)}
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
                        <DialogTitle>{currentTestimonial._id ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    value={currentTestimonial.name || ""}
                                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Input
                                    value={currentTestimonial.role || ""}
                                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company</label>
                                <Input
                                    value={currentTestimonial.company || ""}
                                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating (1-5)</label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={currentTestimonial.rating || 5}
                                    onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: Number(e.target.value) })}
                                    required
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image URL</label>
                            <Input
                                value={currentTestimonial.image || ""}
                                onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, image: e.target.value })}
                                placeholder="https://..."
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                                value={currentTestimonial.content || ""}
                                onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value })}
                                required
                                className="bg-white/5 border-white/10 min-h-[100px]"
                            />
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
