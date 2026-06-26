# CP.cpp - Coding Club Manager

**CP.cpp** is a comprehensive, real-time dashboard application designed to manage, monitor, and track the progress of a coding club. It provides tools for tracking student performance, managing contests, monitoring attendance, and organizing learning resources with instant, real-time updates.

> [!NOTE]
> CP.cpp is built using a hybrid Next.js architecture, utilizing the App Router for views/REST APIs and the Pages Router for real-time WebSocket server handling via Socket.io.

---

## 🚀 Features

### 📊 Interactive Dashboard
- Get a real-time snapshot of the club's health, including Total Students, Problems Solved, Skill Distribution, and Engagement statistics.
- Dynamic visualizations powered by **Recharts**.

### ⚡ Real-Time Engine (Socket.io)
- Changes in attendance, leaderboards, and problem sets are propagated instantly.
- Real-time event notifications and cache invalidations for key actions:
  | WebSocket Event | Trigger Action | Affected Pages |
  | :--- | :--- | :--- |
  | `STUDENT_UPDATED` | Student profile sync / edit | Leaderboard, Students, Dashboard |
  | `TRICK_ADDED` | A new CP trick is added | CP Tricks resource page |
  | `POTD_ADDED` / `POTD_VERIFIED` | POTD management & solution verification | POTD Dashboard & Leaderboard |
  | `ATTENDANCE_UPDATED` | Live attendance marking | Attendance sheets |

### 🏆 Codeforces Integration & Batch Syncing
- Seamlessly updates student performance metrics directly from Codeforces.
- **Optimized Batch Sync API (`/api/students/sync-all-participation`)**: Implements smart caching and rate-limiting safeguards (sequenced standings and user status requests) to bypass Codeforces API throttling.
- Tracks `currentRating`, rating history, and contest attendance (standings matching).

### 🧩 Additional Features
- **Problem of the Day (POTD)**: Daily coding challenges with streak tracking and year-wise batch filtering.
- **Dynamic Leaderboards**: Filter standings by graduating year/batch based on student credentials.
- **Resource Hub**: Practice problem lists, educational theory materials, and CP tricks.
- **Role-Based Access Control**: Admins, coordinators, and students with an approval workflow.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router & Pages Router hybrid)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Real-time Server**: [Socket.io](https://socket.io/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Lucide React)
- **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
- **AI Tooling**: [Firebase Genkit](https://firebase.google.com/docs/genkit)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (recommended)
- MongoDB instance (Atlas or local)
- Firebase Project Credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/cp.cpp.git
   cd cp.cpp
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file from the template:
   ```bash
   cp .env.example .env.local
   ```
   Provide values for the following environment keys:
   - `MONGODB_URI`
   - Firebase client/server SDK keys
   - Next.js API configuration endpoints

4. **Start the Development Server:**
   ```bash
   pnpm dev
   ```
   Access the dashboard locally at [http://localhost:9002](http://localhost:9002).

---

## 📜 Available Scripts

- `pnpm dev`: Starts the Next.js development server with Turbopack on port 9002.
- `pnpm build`: Compiles the application for production.
- `pnpm start`: Launches the compiled production server.
- `pnpm lint`: Runs ESLint to check for code quality and styling.
- `pnpm typecheck`: Runs TypeScript type checking (`tsc --noEmit`).
- `pnpm genkit:dev`: Launches the Genkit developer UI.

---

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router (views, layouts, metadata & API endpoints)
│   └── api/          # RESTful backend APIs (students, clubs, POTD, etc.)
├── pages/            # Next.js Pages Router (exclusively hosting /api/socket/io server)
├── components/       # Custom React & shadcn components
│   └── ui/           # Generic design system components (e.g. small-bubble.tsx)
├── context/          # Global Context Providers (Auth, Theme, Socket.io)
├── hooks/            # Custom React hooks (useSocket, useAuth, etc.)
├── models/           # Mongoose models (Student, Club, Contest, Trick, etc.)
├── lib/              # Shared utility functions (dbConnect, firebase configurations)
├── types/            # TypeScript type declaration files
└── ai/               # Genkit AI workflows and schemas
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.