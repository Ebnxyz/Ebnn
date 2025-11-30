// Vercel Serverless Function Endpoint: /api/subscribe
// Handles database insertion (PostgreSQL) and sends a welcome email (Resend).
import { Resend } from 'resend';
import { Client } from 'pg';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the source email address for confirmations
const FROM_EMAIL = 'welco@social.ebnn.xyz';
const LOGO_URL = 'https://ebnn.xyz/pfp.png';

/**
 * Initializes the PostgreSQL client using the Vercel environment variable.
 */
function getDbClient() {
    // The connection URL (DATABASE_URL) must be set in Vercel environment variables.
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set.");
    }
    return new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for some cloud providers like Aiven/Neon/Supabase on Vercel
        }
    });
}

/**
 * Ensures the 'subscribers' table exists.
 * @param {Client} client - The PostgreSQL client instance.
 */
async function ensureTableExists(client) {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS subscribers (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await client.query(createTableQuery);
}

/**
 * Sends a welcome email to the new subscriber.
 * @param {string} email - The subscriber's email address.
 */
async function sendWelcomeEmail(email) {
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


export default async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    const { email } = req.body;

    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'A valid email address is required.' });
    }

    let client;
    try {
        client = getDbClient();
        await client.connect();
        
        // 1. Ensure the table exists
        await ensureTableExists(client);

        // 2. Insert email, handling duplicates silently (ON CONFLICT DO NOTHING)
        const insertQuery = `
            INSERT INTO subscribers (email)
            VALUES ($1)
            ON CONFLICT (email) DO NOTHING
            RETURNING id;
        `;
        const result = await client.query(insertQuery, [email]);
        
        // Check if a row was actually inserted (i.e., not a duplicate)
        if (result.rows.length > 0) {
            // 3. Send welcome email only if it's a new subscription
            await sendWelcomeEmail(email);
            return res.status(201).json({ message: 'Successfully subscribed and welcome email sent!' });
        } else {
            // It was a duplicate entry
            return res.status(200).json({ message: 'You are already subscribed.' });
        }

    } catch (error) {
        console.error('Subscription Error:', error);
        return res.status(500).json({ message: 'Internal server error during subscription.' });
    } finally {
        if (client) {
            await client.end();
        }
    }
};
