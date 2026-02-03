import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'connect@social.ebnn.xyz';
const ADMIN_EMAIL = 'itsmejinnsir@gmail.com';

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const emailSubject = subject ? `New Contact: ${subject}` : `New Contact Form Submission from ${name}`;

        // 1. Send Notification Email to Admin
        const adminEmailPromise = resend.emails.send({
            from: 'Contact Form <contact@co.ebnn.xyz>',
            to: 'welco@ebnn.xyz', // Admin email
            subject: emailSubject,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #00BFFF; border-bottom: 2px solid #00BFFF; padding-bottom: 10px;">New Message from ebnn.xyz</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                    <h3 style="margin-top: 20px;">Message:</h3>
                    <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 3px solid #00BFFF;">${message}</p>
                    <p style="margin-top: 30px; font-size: 0.9em; color: #777;">Sent via the ebnn.xyz contact form.</p>
                </div>
            </div>
        `,
        });

        // 2. Send Confirmation Email to User
        const userConfirmationPromise = resend.emails.send({
            from: FROM_EMAIL,
            to: email, // Send to the user's submitted email
            subject: "Message Received - Ebin Sebastian Jiji",
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #00BFFF; border-bottom: 2px solid #00BFFF; padding-bottom: 10px;">Thank You for Reaching Out!</h2>
                    <p>Hi ${name},</p>
                    <p>Your message has been successfully received by Ebin Sebastian Jiji.</p>
                    <p>I aim to respond to all inquiries within 1-2 business days.</p>
                    <h3 style="margin-top: 20px;">Your Message Summary:</h3>
                    <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 4px; border-left: 3px solid #00BFFF;">${message}</p>
                    <p style="margin-top: 30px; color: #555;">Best regards,</p>
                    <p style="color: #00BFFF; font-weight: bold;">Ebin Sebastian Jiji</p>
                </div>
            </div>
        `,
        });

        await Promise.all([adminEmailPromise, userConfirmationPromise]);

        return NextResponse.json({ message: 'Messages sent successfully' });
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
