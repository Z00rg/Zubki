import {Montserrat} from 'next/font/google';
import './globals.css';
import {AppProvider} from '@/shared/lib/app-provider';
import {Metadata} from "next";
import {MyToastRegion} from "@/shared/ui/Toast";

const montserrat = Montserrat({subsets: ['latin']});

export const metadata: Metadata = {
    title: {
        default: "Планирование дентальных имплантов",
        template: "%s — АРМ врача",
    },
    robots: {
        index: true,
        follow: true,
    },
    description: "Система автоматизированного проектирования для планирования дентальных имплантов",
    applicationName: "Планирование дентальных имплантов",
    appleWebApp: {
        title: "Планирование дентальных имплантов",
        capable: true,
    },
    icons: {
        apple: "/apple-icon.png",
    },

    // OpenGraph preview
    openGraph: {
        title: "Планирование дентальных имплантов",
        description: "Система автоматизированного проектирования для планирования дентальных имплантов",
        type: "website",
        url: "https://dental-implant-smr.ru/",
        images: [
            {
                url: "https://dental-implant-smr.ru/og-atlas.png",
                width: 1200,
                height: 630,
                alt: "Планирование дентальных имплантов",
            },
        ],
    },


    manifest: "/manifest.webmanifest",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={montserrat.className}>
        <AppProvider>
                    {children}
                    <MyToastRegion />
        </AppProvider>
        </body>
        </html>
    );
}