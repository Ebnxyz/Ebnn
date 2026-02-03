'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubscribePage() {
    const [formStatus, setFormStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({ message: '', type: '' });

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Subscription failed');

            setFormStatus({ message: data.message, type: 'success' });
            (e.target as HTMLFormElement).reset();
        } catch (error: any) {
            setFormStatus({ message: error.message || 'Network error.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-bg-dark font-sans text-white">
            <div className="w-full max-w-lg mx-auto">
                <div className="bg-gray-900/90 p-8 sm:p-12 rounded-2xl border border-gray-800 shadow-2xl shadow-neon/20">

                    <Link href="/#contact" className="text-neon-hover text-sm mb-4 inline-flex items-center hover:underline group">
                        <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Portfolio
                    </Link>

                    <div className="text-center mb-10">
                        {/* Using <img> for simplicity with external fallback logic */}
                        <div className="w-20 h-20 mx-auto mb-4 border-2 border-neon rounded-full overflow-hidden">
                            <img src="/pfp.png"
                                alt="Ebin Sebastian Jiji"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold neon-text mb-2">
                            Join the Journey
                        </h1>
                        <p className="text-lg text-gray-400">
                            Get my latest insights on technology, creative direction, and projects.
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Your Email Address"
                            className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:border-neon focus:ring-1 focus:ring-neon transition-colors duration-200 text-lg placeholder-gray-400 text-white"
                            required
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full glow-on-hover px-6 py-4 rounded-lg font-semibold bg-neon-hover text-bg-dark hover:bg-neon-hover transition-all duration-300 shadow-lg shadow-neon/50 flex items-center justify-center text-lg disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <span>Processing...</span>
                                    <div className="ml-3 animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
                                </>
                            ) : (
                                <span>Subscribe Now</span>
                            )}
                        </button>
                    </form>

                    {formStatus.message && (
                        <div className={`mt-6 p-4 rounded-lg text-center font-medium ${formStatus.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {formStatus.message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
