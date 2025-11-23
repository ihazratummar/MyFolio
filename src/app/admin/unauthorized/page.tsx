"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-background to-background pointer-events-none" />

            <div className="relative z-10 text-center max-w-md px-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6 animate-pulse">
                    <ShieldAlert className="w-12 h-12 text-red-500" />
                </div>

                <h1 className="text-4xl font-bold font-heading mb-2 text-foreground">Access Denied</h1>
                <p className="text-muted-foreground mb-8">
                    You do not have permission to access the admin panel. This attempt has been logged and reported to the administrator.
                </p>

                <div className="space-y-4">
                    <Link href="/">
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Return to Home
                        </Button>
                    </Link>
                    <Link href="/admin/login">
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                            Try Different Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
