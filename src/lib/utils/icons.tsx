import { Github, Linkedin, Twitter, Instagram, Facebook, Youtube, Mail, MapPin, Phone, ExternalLink, Smartphone, MessageCircle, MessageSquare, Bot, Server, Code, Globe, Database, Layout, Terminal, Cpu, Zap } from "lucide-react";

export const iconMap: { [key: string]: any } = {
    Github,
    Linkedin,
    Twitter,
    Instagram,
    Facebook,
    Youtube,
    Mail,
    MapPin,
    Phone,
    ExternalLink,
    Smartphone,
    MessageCircle,
    MessageSquare,
    Bot,
    Server,
    Code,
    Globe,
    Database,
    Layout,
    Terminal,
    Cpu,
    Zap
};

export const getIcon = (name: string) => {
    return iconMap[name] || Globe; // Default to Globe if not found
};
