"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getIcon } from "@/lib/utils/icons";
import { PricingModal } from "@/components/modals/PricingModal";
import { HireMeModal } from "@/components/modals/HireMeModal";

const DiscordIcon = ({ className }: { className?: string }) => (
    <img src="/discord.svg" alt="Discord" className={className} />
);

const services = [
    {
        title: "Discord Bot Development",
        category: "Development",
        description: "Custom bots with advanced features, moderation tools, and API integrations tailored to your community needs.",
        price: "From $50",
        icon: "Bot",
        tiers: [
            {
                name: "Basic Bot",
                price: "$50",
                description: "Essential moderation and utility commands.",
                features: ["Moderation Commands", "Welcome System", "Auto-Role", "Uptime 99.9%"],
                popular: false
            },
            {
                name: "Advanced Bot",
                price: "$150",
                description: "Custom features, API integrations, and database support.",
                features: ["All Basic Features", "Database Integration", "Custom API", "Economy System", "Ticket System"],
                popular: true
            },
            {
                name: "Enterprise Bot",
                price: "$300+",
                description: "Full-scale bot for large communities with dashboard.",
                features: ["All Advanced Features", "Web Dashboard", "Payment Integration", "Priority Support", "Custom Branding"],
                popular: false
            }
        ]
    },
    {
        title: "Mobile App Development",
        category: "Development",
        description: "Native and cross-platform mobile applications built with React Native for iOS and Android.",
        price: "From $500",
        icon: "Smartphone",
        tiers: []
    },
    {
        title: "Backend Development",
        category: "Development",
        description: "Robust and scalable backend systems using Node.js, Express, and MongoDB.",
        price: "From $300",
        icon: "Server",
        tiers: []
    },
    {
        title: "UI/UX Design",
        category: "Design",
        description: "Modern and intuitive user interface designs that enhance user experience.",
        price: "From $200",
        icon: "Palette",
        tiers: []
    }
];

export const Services = () => {
    return (
        <section id="services" className="py-20 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4">
                        My <span className="text-primary">Services</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Specialized solutions tailored to your needs.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => {
                        const Icon = service.title === "Discord Bot Development" ? DiscordIcon : getIcon(service.icon);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="bg-card/30 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 h-full flex flex-col hover:-translate-y-2 group">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            {service.category && (
                                                <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs">
                                                    {service.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-xl font-bold line-clamp-2">{service.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                                            {service.description}
                                        </p>
                                        <div className="text-2xl font-bold text-foreground">
                                            {service.price}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {service.tiers && service.tiers.length > 0 ? (
                                            <PricingModal serviceType={service.title as any}>
                                                <Button className="w-full bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all duration-300">
                                                    View Plans
                                                </Button>
                                            </PricingModal>
                                        ) : (
                                            <HireMeModal>
                                                <Button className="w-full bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all duration-300">
                                                    Get Started
                                                </Button>
                                            </HireMeModal>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
