"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FolderKanban, Briefcase, MessageSquare, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Projects", href: "/admin/projects", icon: FolderKanban },
        { name: "Services", href: "/admin/services", icon: Briefcase },
        { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-card/30 backdrop-blur-md flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="text-2xl font-bold font-heading tracking-tighter">
                        Hazrat<span className="text-primary">.dev</span>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-muted-foreground">Logged in</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black/20 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
