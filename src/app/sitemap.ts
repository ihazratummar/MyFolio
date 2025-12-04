import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://hazratdev.top'

    // Function to recursively find all page.tsx files
    function getPages(dir: string, baseUrl: string): string[] {
        const files = fs.readdirSync(dir)
        let pages: string[] = []

        files.forEach((file) => {
            const filePath = path.join(dir, file)
            const stat = fs.statSync(filePath)

            if (stat.isDirectory()) {
                // Skip special Next.js directories and api routes, but allow route groups (starting with '(')
                if (file.startsWith('_') || file === 'api') return

                pages = [...pages, ...getPages(filePath, baseUrl)]
            } else {
                if (file === 'page.tsx' || file === 'page.js') {
                    // Convert file path to URL path
                    // Remove src/app prefix and page.tsx suffix
                    let relativePath = filePath
                        .replace(/\\/g, '/') // Normalize slashes for Windows
                        .split('src/app')[1]
                        .replace('/page.tsx', '')
                        .replace('/page.js', '')
                        // Remove route groups like (site) from the path
                        .replace(/\/\([^)]+\)/g, '')

                    // Handle root page
                    if (relativePath === '') relativePath = '/'

                    pages.push(relativePath)
                }
            }
        })
        return pages
    }

    const appDir = path.join(process.cwd(), 'src', 'app')
    const pages = getPages(appDir, baseUrl)

    return pages.map((route) => ({
        url: `${baseUrl}${route === '/' ? '' : route}`,
        lastModified: new Date(),
        changeFrequency: route === '/' ? 'monthly' : 'yearly',
        priority: route === '/' ? 1 : 0.8,
    }))
}
