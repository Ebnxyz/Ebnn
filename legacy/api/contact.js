// Vercel Serverless Function Endpoint: /api/contact
// This file assumes you have installed the Resend SDK: npm install resend
import { Resend } from 'resend';

// Initialize Resend. The API key is securely loaded from your Vercel Environment Variables.
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the source email address for user confirmations
const FROM_EMAIL = 'connect@social.ebnn.xyz';
// Define the destination email address for admin notifications
const ADMIN_EMAIL = 'itsmejinnsir@gmail.com';

/**
 * Sends two emails: one to the admin, and one confirmation to the user.
 * @param {object} data - Contains name, email, and message from the form submission.
 */
async function sendContactEmails(data) {
    const { name, email, message } = data;

    // 1. Send Notification Email to Admin
    const adminEmailPromise = resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `NEW Contact from ebnn.xyz: ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #00BFFF; border-bottom: 2px solid #00BFFF; padding-bottom: 10px;">New Message from ebnn.xyz</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
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

    // Run both email sends concurrently
    await Promise.all([adminEmailPromise, userConfirmationPromise]);
}


export default async (req, res) => {
    // --- CRITICAL: Check the method ---
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        // Returns the 405 error with the allowed method
        return res.status(405).json({ 
            message: `Method ${req.method} is not allowed. Only POST is accepted.` 
        });
    }

    // Basic input validation
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields: name, email, or message.' });
    }

    try {
        await sendContactEmails({ name, email, message });
        
        // Success response
        return res.status(200).json({ message: 'Messages sent successfully.' });
    } catch (error) {
        // Log the error internally
        console.error('Resend Email Error:', error);
        
        // Return a generic error to the client
        return res.status(500).json({ message: 'Failed to send messages due to an internal server error.' });
    }
};
