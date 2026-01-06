# Smile Ink - Roblox Animation Community Platform

## Overview

Smile Ink is a community platform for "Animation World," described as the first 2D animation game on Roblox. The platform consists of a React frontend with a Node.js/Express backend, featuring a Discord bot integration for marketplace functionality. Users can view team members, browse a marketplace of hiring/for-hire posts, and interact through Discord commands.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI animations
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

The frontend follows a pages-based structure with reusable components. Custom hooks abstract data fetching logic (use-posts.ts, use-team.ts). The UI uses a dark theme with yellow/gold accent colors defined via CSS custom properties.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation schemas
- **Discord Integration**: discord.js for bot commands and marketplace post moderation

The server uses a storage pattern (storage.ts) that abstracts database operations. Routes are registered in routes.ts and the bot runs alongside the Express server.

### Data Storage
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **Schema**: Two main tables - `posts` (marketplace listings) and `teamMembers` (team display)
- **ORM**: Drizzle with drizzle-zod for schema validation
- **Migrations**: Located in /migrations, managed via `drizzle-kit push`

### Build System
- **Development**: tsx for TypeScript execution, Vite for frontend HMR
- **Production**: Custom build script using esbuild for server bundling, Vite for client
- **Output**: dist/index.cjs (server) and dist/public/ (client static files)

## External Dependencies

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (required)
- `DISCORD_TOKEN` - Discord bot token (optional, bot skipped if missing)
- `DISCORD_CLIENT_ID` - Discord application client ID (optional)

### Third-Party Services
- **Discord**: Bot integration for /post slash command, handles marketplace post creation and moderation workflow with specific channel IDs for review, hiring, and for-hire posts
- **PostgreSQL**: Primary data store accessed via Drizzle ORM
- **Google Fonts**: Outfit and DM Sans font families loaded externally

### Key npm Dependencies
- discord.js for Discord bot functionality
- drizzle-orm + drizzle-zod for database operations
- @tanstack/react-query for frontend data fetching
- framer-motion for animations
- Full shadcn/ui component library with Radix UI primitives