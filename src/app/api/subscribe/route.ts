import { Resend } from 'resend';
import { Client } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'welco@social.ebnn.xyz';
const LOGO_URL = 'https://ebnn.xyz/pfp.png';

function getDbClient() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL environment variable is not set.");
    }
    return new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

async function ensureTableExists(client: Client) {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS subscribers (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await client.query(createTableQuery);
}

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

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: 'Valid email required' }, { status: 400 });
        }

        const client = getDbClient();
        await client.connect();

        try {
            await ensureTableExists(client);

            const insertQuery = `
                INSERT INTO subscribers (email)
                VALUES ($1)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;
            `;
            const result = await client.query(insertQuery, [email]);

            if (result.rows.length > 0) {
                await sendWelcomeEmail(email);
                return NextResponse.json({ message: 'Successfully subscribed and welcome email sent!' }, { status: 201 });
            } else {
                return NextResponse.json({ message: 'You are already subscribed.' }, { status: 200 });
            }
        } finally {
            await client.end();
        }
    } catch (error) {
        console.error('Subscription Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
