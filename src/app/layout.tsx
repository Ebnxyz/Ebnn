import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    variable: '--font-poppins',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Ebin Sebastian Jiji — Student, Creative Director & Innovator',
    description: 'Portfolio of Ebin Sebastian Jiji, a 12th-grade student and Creative Director from Kannur, Kerala.',
    keywords: ['Ebin Sebastian Jiji', 'Portfolio', 'Creative Director', 'Kannur', 'Kerala', 'Web Developer'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            </head>
            <body className={`${poppins.variable} font-sans bg-bg-dark text-white overflow-x-hidden`}>
                {children}
            </body>
        </html>
    );
}
