# Ebnn - Digital Space

This is the personal portfolio website of **Ebin Sebastian Jiji**, built with **Next.js 14**, **Tailwind CSS**, and **Resend**.

## Features

- **Premium Design**: Neon Blue theme with glassmorphism and smooth animations.
- **Full Stack Next.js**: Uses App Router and Server Actions/API Routes.
- **Subscription**: Integrated with **Resend Audiences** for newsletter management.
- **Contact Form**: Sends email notifications via Resend.

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/avrxt-development/Ebnn.git
    cd Ebnn
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env.local` file with the following secrets:
    ```env
    RESEND_API_KEY=re_123...
    RESEND_AUDIENCE_ID=aud_123...
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Deploy on Vercel

The easiest way to deploy is to use the [Vercel Platform](https://vercel.com/new).

1.  Connect your GitHub repository.
2.  Vercel will detect `Next.js`.
3.  Add the **Environment Variables** (`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`).
4.  Deploy!

## License

[MIT](LICENSE)
