'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
    const [heroLoaded, setHeroLoaded] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isTypingStarted, setIsTypingStarted] = useState(false);

    // Contact Form State
    const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Scroll Reveal Refs
    const revealRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        // 1. Hero Animation
        const timer = setTimeout(() => {
            setHeroLoaded(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // 2. Scroll Reveal Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');

                    // Start typing when About section is visible
                    if (entry.target.id === 'about' && !isTypingStarted) {
                        setIsTypingStarted(true);
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });

        revealRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [isTypingStarted]);

    useEffect(() => {
        // 3. Typing Effect
        if (isTypingStarted && typingText.length < fullText.length) {
            const timeout = setTimeout(() => {
                setTypingText(fullText.slice(0, typingText.length + 1));
            }, 40);
            return () => clearTimeout(timeout);
        }
    }, [isTypingStarted, typingText]);

    const fullText = "I’m a 12th-grade student passionate about creativity, technology, and digital media.";

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({ message: '', type: '' });

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send message');

            setFormStatus({ message: 'Message sent! Check your inbox for confirmation.', type: 'success' });
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            setFormStatus({ message: 'Network error. Could not connect to the server.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen">
            {/* 1. WELCOME SCREEN (HERO SECTION) */}
            <section id="hero" className={`h-screen py-0 relative overflow-hidden flex items-center justify-center ${heroLoaded ? 'hero-loaded' : ''}`}>

                {/* Particle Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="w-96 h-96 rounded-full bg-neon opacity-10 absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
                    <div className="w-80 h-80 rounded-full bg-neon opacity-5 absolute bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
                </div>

                <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
                    <div id="hero-text" className="space-y-4 transition-all duration-1000 ease-out transform translate-y-5 opacity-0">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Hi, I’m <span className="neon-text">Ebin Sebastian Jiji</span>
                        </h1>
                        <p className="text-xl sm:text-2xl font-light text-gray-400">
                            Student • Creative Director • Innovator
                        </p>
                        <p className="text-lg sm:text-xl font-medium text-white">
                            From <span className="neon-text">Kannur, Kerala</span> — God’s Own Country
                        </p>
                    </div>

                    <div id="hero-buttons" className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                        <a href="#projects" className="hero-btn opacity-0 translate-y-2 glow-on-hover px-10 py-3 rounded-xl font-semibold bg-neon-hover text-bg-dark hover:bg-neon-hover border border-neon transition-all duration-300 shadow-lg shadow-neon/50">
                            <i className="fas fa-layer-group mr-2"></i> View My Work
                        </a>
                        <a href="#about" className="hero-btn opacity-0 translate-y-2 glow-on-hover px-10 py-3 rounded-xl font-semibold bg-transparent text-white neon-border hover:bg-neon/10 transition-all duration-300">
                            <i className="fas fa-user-circle mr-2"></i> About Me
                        </a>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT SECTION */}
            <section id="about" ref={addToRefs} className="bg-gray-900 reveal-item py-32 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-12 neon-text">About Me</h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-8 rounded-2xl bg-gray-800/50">
                        {/* Profile Photo */}
                        <div className="w-36 h-36 flex-shrink-0 rounded-full overflow-hidden neon-border p-1">
                            {/* Using img for external consistency or public folder */}
                            <img src="/pfp.png"
                                alt="Ebin Sebastian Jiji"
                                className="w-full h-full object-cover rounded-full transition-transform duration-300 hover:scale-110"
                            />
                        </div>

                        {/* Bio Text */}
                        <div className="md:text-left">
                            <p className="text-xl leading-relaxed text-gray-300 min-h-[60px]">
                                <span className="font-medium text-white">{typingText}</span>
                                <span className="cursor animate-pulse">|</span>
                            </p>
                            <p className="text-sm mt-4 text-gray-400">
                                Passionate about creativity, technology, and digital media. I love building ideas into reality.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SKILLS SECTION */}
            <section id="skills" ref={addToRefs} className="reveal-item py-32 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center neon-text">My Skills</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
                        {[
                            { icon: 'fa-lightbulb', title: 'Creative Direction' },
                            { icon: 'fa-palette', title: 'Graphic Design' },
                            { icon: 'fa-code', title: 'Web/Tech Enthusiast' },
                            { icon: 'fa-video', title: 'Content Creation' },
                            { icon: 'fa-hands-helping', title: 'Leadership' }
                        ].map((skill, idx) => (
                            <div key={idx} className="p-4 sm:p-6 rounded-xl bg-gray-800/70 border border-gray-700/50 text-center hover:shadow-neon glow-on-hover flex flex-col items-center group transition-colors">
                                <i className={`fas ${skill.icon} text-3xl sm:text-4xl neon-text mb-3 group-hover:scale-110 transition-transform`}></i>
                                <h3 className="text-sm sm:text-lg font-semibold text-white">{skill.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PROJECTS SECTION */}
            <section id="projects" ref={addToRefs} className="bg-gray-900 reveal-item py-32 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center neon-text">Featured Project</h2>

                    <div className="p-8 md:p-12 rounded-2xl bg-gray-800/70 border border-gray-700/50 transform transition-all duration-500 hover:shadow-neon/50">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 neon-border rounded-full overflow-hidden p-1 bg-white">
                                <img src="https://cdn.axt.co.in/logo.jpg" alt="Axtcity Logo" className="w-full h-full object-cover rounded-full" />
                            </div>

                            <div className="md:text-left text-center flex-grow">
                                <span className="text-sm font-light text-neon">CREATIVE DIRECTOR ROLE</span>
                                <h3 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">
                                    AxtCity Roleplay
                                </h3>
                                <p className="text-lg text-gray-300 mb-4">
                                    A Wonderful Roleplay Server Website AxtCity Roleplay.
                                </p>
                                <p className="text-base text-gray-400 font-light italic">
                                    "AxtCity creates a canvas where your story provides the color. A new generation of immersive roleplay defined by choice, consequence, and freedom. Play Behind Reality."
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 text-center md:text-right">
                            <a href="https://axtcity.online" target="_blank" rel="noopener noreferrer" className="glow-on-hover px-10 py-3 rounded-xl font-semibold bg-neon-hover text-bg-dark hover:bg-neon-hover border border-neon transition-all duration-300 shadow-lg shadow-neon/50 inline-block">
                                <i className="fas fa-external-link-alt mr-2"></i> Visit Live Site
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. LOCATION FEATURE */}
            <section id="location" ref={addToRefs} className="reveal-item py-32 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-text">Current Location</h2>

                    <div className="p-10 rounded-2xl bg-gray-800/50 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'radial-gradient(circle at 75% 25%, var(--primary-accent) 0%, transparent 40%)', mixBlendMode: 'screen' }}></div>

                        <p className="text-3xl font-medium text-white mb-2 relative z-10">
                            <i className="fas fa-map-marker-alt text-neon-hover mr-3"></i> Kannur, Kerala
                        </p>
                        <p className="text-lg text-gray-400 relative z-10">— God’s Own Country —</p>
                    </div>
                </div>
            </section>

            {/* 6. CONTACT SECTION */}
            <section id="contact" ref={addToRefs} className="bg-gray-900 reveal-item py-32 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center neon-text">Get in Touch</h2>
                    <p className="text-xl text-center text-gray-400 mb-12">
                        Let’s create something amazing together.
                    </p>

                    <div className="bg-gray-800/70 p-8 rounded-2xl">

                        {/* Functional Contact Form */}
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                            <input type="text" name="name" placeholder="Your Name" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-neon focus:ring-1 focus:ring-neon transition-colors duration-200" required />
                            <input type="email" name="email" placeholder="Your Email" className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-neon focus:ring-1 focus:ring-neon transition-colors duration-200" required />
                            <textarea name="message" placeholder="Your Message" rows={4} className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-neon focus:ring-1 focus:ring-neon transition-colors duration-200" required></textarea>

                            <button type="submit" disabled={isSubmitting} className="w-full glow-on-hover px-6 py-3 rounded-lg font-semibold bg-neon-hover text-bg-dark hover:bg-neon-hover transition-all duration-300 shadow-lg shadow-neon/50 flex items-center justify-center disabled:opacity-50">
                                {isSubmitting ? (
                                    <>
                                        <span>Sending...</span>
                                        <div className="ml-3 animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
                                    </>
                                ) : (
                                    <span>Send Message</span>
                                )}
                            </button>

                            {formStatus.message && (
                                <div className={`p-3 rounded-lg text-center font-medium ${formStatus.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                                    {formStatus.message}
                                </div>
                            )}
                        </form>

                        {/* Social Icons */}
                        <div className="flex justify-center gap-6 mt-10">
                            <a href="mailto:welco@ebnn.xyz" target="_blank" className="text-3xl text-gray-400 hover:text-neon transition-colors duration-200 glow-on-hover p-2 rounded-full">
                                <i className="fas fa-envelope"></i>
                            </a>
                            <a href="https://www.instagram.com/eb_nnn_?igsh=MWZtaDhxeWJwZGhpMA==" target="_blank" className="text-3xl text-gray-400 hover:text-neon transition-colors duration-200 glow-on-hover p-2 rounded-full">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://github.com/JINN0SER0THE0SPY" target="_blank" className="text-3xl text-gray-400 hover:text-neon transition-colors duration-200 glow-on-hover p-2 rounded-full">
                                <i className="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FOOTER */}
            <footer className="bg-bg-dark py-8 border-t border-gray-800">
                <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
                    <p>&copy; 2025 Ebin Sebastian Jiji | <span className="neon-text">ebnn.xyz</span></p>
                    <p className="mt-1">Built with passion from Kerala.</p>
                </div>
            </footer>

            {/* Styles for reveal items (moved from global CSS for clarity or if needed localized) */}
            <style jsx>{`
        .reveal-item {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 1s ease-out, transform 1s cubic-bezier(0.2, 0.5, 0.2, 1);
        }
        .reveal-item.active {
          opacity: 1;
          transform: translateY(0);
        }
        #hero-text.hero-loaded { opacity: 1; transform: translateY(0); }
        .hero-btn { transition-delay: 1.2s; }
        .hero-btn:nth-child(2) { transition-delay: 1.4s; }
        .hero-loaded .hero-btn { opacity: 1; transform: translateY(0); }
      `}</style>
        </main>
    );
}
