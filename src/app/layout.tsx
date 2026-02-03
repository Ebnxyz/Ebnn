import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
    display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: '--font-mono',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "THE EBNN | Ebin Sebastian",
    description: "EBNN Digital Ecosystem & Subscription Uplink",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <script src="https://unpkg.com/lucide@latest"></script>
            </head>
            <body className={`${outfit.variable} ${jetbrainsMono.variable} font-sans bg-bg-dark text-slate-100 antialiased overflow-x-hidden selection:bg-blue-500/30`}>
                {children}
            </body>
        </html>
    );
}
