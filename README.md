# CP.cpp - Coding Club Manager

**CP.cpp** is a comprehensive dashboard application designed to manage and track the progress of a coding club. It provides tools for monitoring student performance, managing contests, tracking attendance, and organizing learning resources.

## 🚀 Features

- **Interactive Dashboard**: Get a real-time snapshot of your club's health with metrics like Total Students, Problems Solved, Skill Distribution, and Engagement stats.
- **Student Management**: efficient ways to add, update, and manage club members.
- **Contest Tracking**: Organize and track participation in coding contests.
- **Leaderboard**: dynamic leaderboards to foster healthy competition among students.
- **Attendance System**: Digital attendance tracking for club meetings and events.
- **Resource Hub**: A curated section for Practice problems, Theory materials, and "Think" challenges.
- **Authentication**: Secure user access management.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Primitives), [Lucide React](https://lucide.dev/) (Icons)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [GSAP](https://gsap.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Authentication**: [Firebase](https://firebase.google.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- MongoDB instance
- Firebase project credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cp.cpp
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Create a `.env.local` file in the root directory and add your environment variables (MongoDB URI, Firebase config, etc.).

   ```env
   # Example variables (adjust based on actual usage)
   MONGODB_URI=...
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   # ... other required keys
   ```

4. **Run the development server:**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `pnpm dev`: Starts the Next.js development server with Turbopack.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code quality issues.
- `pnpm typecheck`: Runs TypeScript type checking.
- `pnpm genkit:dev`: Starts the Genkit development environment.

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
├── components/       # Reusable UI components (Dashboard, Layout, etc.)
├── context/          # React Context providers (Auth, Theme)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations (DB, Firebase)
├── models/           # Mongoose data models (Student, Contest, etc.)
├── types/            # TypeScript type definitions
└── ai/               # Genkit AI configurations and flows
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
