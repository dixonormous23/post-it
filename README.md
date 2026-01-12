# Sticky Notes & Calendar App

A beautiful, iPad-optimized sticky notes application with Google Calendar integration. Built with Next.js, Styled Components, and Framer Motion.

## Features

- **Draggable Sticky Notes**: Create, edit, and organize notes on a canvas
- **Color Customization**: 8 pastel color options for notes
- **Resize Notes**: Drag corner to resize
- **Local Storage**: Notes persist in browser storage
- **Google Calendar Integration**: View upcoming 7 days of events
- **Smooth Animations**: Spring physics for drags, fade/scale for creation/deletion
- **iPad Optimized**: Touch-friendly with 44px+ hit targets

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Google Calendar (Optional)

To enable Google Calendar integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google Calendar API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret

Create a `.env.local` file in the project root:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-string-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate a secret with:
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Create Note**: Click the + button in the toolbar
- **Select Color**: Choose from 6 colors before creating, or change on the note
- **Edit Note**: Click on a note's content to edit
- **Move Note**: Drag the note anywhere on the canvas
- **Resize Note**: Drag the corner handle
- **Delete Note**: Click the X button on the note
- **Calendar**: Click "Sign in with Google" to see your events

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Styled Components
- **Drag & Drop**: @dnd-kit/core
- **Animations**: Framer Motion
- **Auth**: NextAuth.js
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth API routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page
├── components/
│   ├── Canvas/                  # Draggable notes canvas
│   ├── Calendar/                # Calendar panel
│   ├── Layout/                  # App layout wrapper
│   ├── StickyNote/              # Individual note component
│   └── Toolbar/                 # Bottom toolbar
├── hooks/
│   ├── useGoogleCalendar.ts     # Calendar API hook
│   ├── useLocalStorage.ts       # localStorage hook
│   └── useNotes.ts              # Notes state management
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   └── styled-registry.tsx      # Styled Components SSR
└── types/
    ├── index.ts                 # Shared types
    └── next-auth.d.ts           # NextAuth type extensions
```

## License

MIT
