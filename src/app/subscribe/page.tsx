'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function SubscribePage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle');
    const [message, setMessage] = useState('');

    async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
            } else if (response.status === 409 || data.message?.includes('already subscribed')) {
                setStatus('duplicate');
            } else {
                setMessage(data.message || 'UPLINK_FAILED');
                setStatus('error');
            }
        } catch (error) {
            setMessage('CONNECTION_ERROR: TIMEOUT');
            setStatus('error');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            <div className="bg-aura fixed top-[-20%] left-[-20%] w-[80vw] h-[80vh] bg-blue-500/10 blur-[80px] -z-10 rounded-full"></div>
            <div className="bg-aura fixed bottom-[-20%] right-[-20%] w-[80vw] h-[80vh] bg-purple-500/10 blur-[80px] -z-10 rounded-full"></div>

            <main className="max-w-md w-full glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl transition-all duration-500 bg-slate-900/60 border border-white/10 backdrop-blur-xl">

                <div className="text-center mb-10">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold text-blue-400 tracking-widest uppercase mb-4">
                        Network Node v2.6
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4 text-white uppercase leading-none">
                        Join the <br /><span className="text-blue-500">EBNN Core.</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                        Receive technical briefings and deployment signals directly to your terminal.
                    </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 ml-2">
                            Authorized Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            className="w-full px-6 py-4 rounded-2xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                            placeholder="name@domain.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-5 bg-blue-600 rounded-2xl font-bold text-white hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                    >
                        {status === 'loading' ? (
                            <><span>Processing...</span><Loader2 className="w-5 h-5 animate-spin" /></>
                        ) : (
                            <><span>Request Access</span><ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>
                </form>

                {status !== 'idle' && status !== 'loading' && (
                    <div className={`mt-6 text-center text-[10px] md:text-xs font-mono tracking-tighter fade-in ${status === 'success' ? 'text-green-400' :
                            status === 'duplicate' ? 'text-blue-400' : 'text-red-400'
                        }`}>
                        {status === 'success' && "> SUBSCRIPTION AUTHORIZED. CHECK INBOX."}
                        {status === 'duplicate' && "> IDENTITY ALREADY LOGGED IN CORE."}
                        {status === 'error' && `> ERROR: ${message}`}
                    </div>
                )}

                <div className="mt-12 flex flex-col items-center gap-6">
                    <Link href="/" className="group flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Core Home
                    </Link>

                    <p className="text-[9px] text-slate-700 uppercase tracking-widest font-mono">
                        Secure SSL Channel // EBNN.XYZ
                    </p>
                </div>
            </main>
        </div>
    );
}
