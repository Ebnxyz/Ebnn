import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon': '#00BFFF',
                'neon-hover': '#00E5FF',
                'bg-dark': '#0A0A0A',
            },
            boxShadow: {
                'neon': '0 0 10px #00BFFF, 0 0 20px #00BFFF',
            },
            fontFamily: {
                sans: ['var(--font-poppins)'],
            }
        },
    },
    plugins: [],
};
export default config;
