# ChatGPT Wrapped

This is a web application that allows you to upload your ChatGPT conversation history (`conversations.json`) and generates a "Spotify Wrapped" style summary of your activity. It visualizes your usage patterns, most discussed topics, and other interesting metrics in a series of shareable cards.

## Key Features

- **Secure File Upload:** Upload your ChatGPT `conversations.json` export.
- **Data Analysis:** Asynchronous backend processing parses conversations, calculates statistics, and identifies key patterns.
- **Dynamic "Wrapped" Generation:** Creates a personalized, animated story with 10+ unique cards showcasing your AI interaction highlights.
- **User Authentication:** Secure sign-in and user management powered by Clerk.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Backend & Database:** [Convex](https://convex.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/UI](https://ui.shadcn.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)

## Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites

- Node.js (v18.8.0 or higher)
- pnpm (or your preferred package manager)
- A Convex account (for the backend)
- A Clerk account (for authentication)

### 2. Clone the Repository

```bash
git clone https://github.com/ayan-goel/chatgpt-wrapped.git
cd chatgpt-wrapped
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root of the project by copying the example file:

```bash
cp .env.local.example .env.local
```

You will need to populate this file with your keys from Convex and Clerk.

- **Convex:** Run `npx convex dev` and follow the prompts. This will create a new project and add `NEXT_PUBLIC_CONVEX_URL` to your `.env.local` file.
- **Clerk:** Create a new application in your Clerk Dashboard and find your Publishable Key and Secret Key.

### 5. Run the Development Servers

You need two terminals running concurrently:

1.  **Run the Convex backend:**
    ```bash
    npx convex dev
    ```
2.  **Run the Next.js frontend:**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository.
2.  Import the project into Vercel.
3.  Connect your Convex project in the Vercel dashboard's "Integrations" tab.
4.  Add your Clerk environment variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`) in the Vercel project settings.
5.  Deploy!
