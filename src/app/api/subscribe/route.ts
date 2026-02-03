import { Resend } from 'resend';

import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'welco@co.ebnn.xyz';
const LOGO_URL = 'https://ebnn.xyz/pfp.png';

async function sendWelcomeEmail(email: string) {
    await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to the Ebin Sebastian Jiji Newsletter!",
        html: `
            <div style="font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #E0E0E0; background-color: #0A0A0A; padding: 20px; border: 1px solid #00BFFF;">
                <div style="max-width: 600px; margin: 0 auto; background: #1A1A1A; padding: 30px; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="${LOGO_URL}" alt="Ebin Sebastian Jiji Logo" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #00BFFF;">
                    </div>
                    <h2 style="color: #00BFFF; text-align: center; margin-bottom: 15px;">You're In!</h2>
                    <p>Hi there,</p>
                    <p>Thank you for subscribing to my newsletter! I'm excited to share my latest projects, insights on creative direction, and technological explorations with you.</p>
                    <p style="margin-top: 20px; text-align: center;">
                        <a href="https://www.ebnn.xyz" style="display: inline-block; padding: 10px 20px; background-color: #00BFFF; color: #0A0A0A; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Visit My Portfolio
                        </a>
                    </p>
                    <p style="margin-top: 30px; font-size: 0.9em; color: #888; text-align: center;">Best regards,<br>Ebin Sebastian Jiji</p>
                </div>
            </div>
        `,
    });
}

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        const audienceId = process.env.RESEND_AUDIENCE_ID;

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: 'Valid email required' }, { status: 400 });
        }

        if (!audienceId) {
            console.error('RESEND_AUDIENCE_ID is missing');
            // Fallback or error? For now, error to alert config issue.
            return NextResponse.json({ message: 'Configuration error: Audience ID missing' }, { status: 500 });
        }

        try {
            // 1. Add to Resend Audience
            const { error } = await resend.contacts.create({
                email: email,
                firstName: 'Subscriber', // Optional, maybe parse from email?
                unsubscribed: false,
                audienceId: audienceId,
            });

            if (error) {
                console.error('Resend Contact Error:', error);
                // Resend returns 422 if exists usually, handle gracefully?
                // But for now, if it fails, we assume error.
                // However, let's treat "already exists" as success logic for the user.
                // The error object might differ.
                // For simplicity, if we fail to add, we can try sending the welcome email anyway or just return logic.
                // But usually we want to confirm subscription.
                // Let's assume error is fatal for now unless we sniff "exists".
                return NextResponse.json({ message: 'Failed to subscribe. Please try again.' }, { status: 500 });
            }

            // 2. Send Welcome Email
            await sendWelcomeEmail(email);

            return NextResponse.json({ message: 'Successfully subscribed and welcome email sent!' }, { status: 201 });

        } catch (apiError) {
            console.error('Resend API Exception:', apiError);
            return NextResponse.json({ message: 'Failed to process subscription.' }, { status: 500 });
        }

    } catch (error) {
        console.error('Subscription Endpoint Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
