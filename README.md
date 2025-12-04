# 🚀 Hazrat.dev - Portfolio Website

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4-47A248?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?style=for-the-badge&logo=docker)

A high-performance, visually stunning portfolio website designed to showcase my expertise as a **Native Android Developer**, **Backend Engineer**, and **Discord Bot Specialist**. Built with modern web technologies, this project emphasizes speed, SEO, and a premium user experience.

🌐 **Live Demo:** [https://hazratdev.top](https://hazratdev.top)

---

## ✨ Key Features

-   **🎨 Premium UI/UX**: Crafted with **Tailwind CSS** and **Framer Motion** for smooth animations and a glassmorphism aesthetic.
-   **⚡ Performance First**:
    -   **Lazy Loading**: Components and animations load only when needed using `LazyMotion`.
    -   **Image Optimization**: Next.js `Image` component for automatic resizing and format conversion (WebP).
    -   **Gzip Compression**: Enabled for faster asset delivery.
-   **🔍 SEO Optimized**:
    -   **Structured Data (JSON-LD)**: Rich snippets for "Person" and "Services" to boost search visibility.
    -   **Meta Tags**: Comprehensive Open Graph and Twitter card metadata.
    -   **Sitemap & Robots.txt**: Auto-generated for perfect crawling.
-   **📱 Fully Responsive**: Flawless experience on mobile, tablet, and desktop.
-   **🛠️ Admin Dashboard**: Secure, Google OAuth-protected admin panel to manage projects, services, and testimonials dynamically.
-   **📬 Real-time Contact**: Contact form submissions are sent directly to a **Discord channel** via webhooks for instant notification.
-   **� Dockerized**: Fully containerized for consistent deployment across any environment.

---

## �️ Tech Stack

-   **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Backend**: Next.js API Routes
-   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
-   **Authentication**: [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) (for Admin Panel)
-   **Deployment**: [Docker](https://www.docker.com/), [Nginx](https://www.nginx.com/)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

-   **Node.js** (v18 or higher)
-   **npm** or **yarn**
-   **MongoDB** (Local or Atlas URI)
-   **Docker** (optional, for containerized run)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ihazratummar/MyFolio.git
    cd MyFolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add the following:
    ```env
    # Database
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myfolio

    # Google OAuth (For Admin Panel)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_REDIRECT_URI=http://localhost:3000/admin/oauth2callback

    # App Config
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ADMIN_EMAIL=hazratummar9@gmail.com
    NODE_ENV=development
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

This project is optimized for Docker. To build and run the container:

1.  **Build the image**:
    ```bash
    docker build -t myfolio:latest .
    ```

2.  **Run the container**:
    ```bash
    docker run -d \
      --name myfolio \
      -p 3000:3000 \
      --env-file .env.local \
      myfolio:latest
    ```

---

## � Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (site)/          # Public facing pages (Home, Privacy, etc.)
│   ├── admin/           # Admin panel pages (Protected)
│   ├── api/             # API Routes
│   ├── layout.tsx       # Root layout with SEO & Providers
│   └── page.tsx         # Landing page
├── components/          # Reusable React components
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Hero, About, Services, Projects, Contact
│   └── ui/              # Shadcn UI components
├── data/                # Static data (portfolio items, skills)
├── lib/                 # Utilities (DB connection, helpers)
└── models/              # Mongoose models (Project, Service, etc.)
```

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or want to add a feature:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## � Contact

**Hazrat Ummar Shaikh**

-   📧 **Email**: [hazratummar9@gmail.com](mailto:hazratummar9@gmail.com)
-   💬 **Discord**: `ihazratummar`
-   💼 **Fiverr**: [hazratummar](https://www.fiverr.com/hazratummar)
-   🐙 **GitHub**: [ihazratummar](https://github.com/ihazratummar)

---

<p align="center">
  Made with ❤️ by Hazrat Ummar Shaikh
</p>
