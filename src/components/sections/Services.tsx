"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { getIcon } from "@/lib/utils/icons";

const DiscordIcon = ({ className }: { className?: string }) => (
    <img src="/discord.svg" alt="Discord" className={className} />
);

import { PricingModal } from "@/components/modals/PricingModal";
import { HireMeModal } from "@/components/modals/HireMeModal";

interface ServiceTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    popular: boolean;
    color: string;
    bg: string;
    border: string;
}

interface Service {
    title: string;
    description: string;
    price: string;
    icon: string;
    tiers: ServiceTier[];
}

export const Services = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('/api/services');
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return <div className="py-20 text-center">Loading services...</div>;
    }

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
                                <Card className="bg-card/30 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground text-sm mb-6">
                                            {service.description}
                                        </p>
                                        <div className="text-2xl font-bold text-foreground">
                                            {service.price}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {service.title === "Discord Bot Development" ? (
                                            <PricingModal serviceType="Discord Bot">
                                                <Button className="w-full bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all duration-300">
                                                    Get Started
                                                </Button>
                                            </PricingModal>
                                        ) : service.title === "Mobile App Development" ? (
                                            <PricingModal serviceType="Mobile App">
                                                <Button className="w-full bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all duration-300">
                                                    Get Started
                                                </Button>
                                            </PricingModal>
                                        ) : service.title === "Backend Development" ? (
                                            <PricingModal serviceType="Backend Development">
                                                <Button className="w-full bg-white/5 hover:bg-primary hover:text-white text-foreground border border-white/10 transition-all duration-300">
                                                    Get Started
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
