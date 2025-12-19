# 🚀CP.cpp (CP Club Manager)

CP Club Manager is a comprehensive web application built with **Next.js** to streamline the management of a student competitive coding club.  
It provides a centralized dashboard for tracking student progress, managing resources, organizing events, and fostering competitive programming culture.

---

## 📸 Screenshots

![Dashboard](public/screenshots/dashboard.png)
![Leaderboard](public/screenshots/leaderboard.png)
![Attendence Tracker](public/screenshots/attendence.png)
![Student manager](public/screenshots/student.png)


---

## ✨ Features

- **Dashboard**
  - Overview of club statistics
  - Participation rates

- **Student Management**
  - Add, edit, and view student details

- **Attendance Tracking**
  - Monitor attendance for meetings and events
  - Maintain historical attendance records

- **Leaderboard**
  - Dynamic leaderboard for contests and activities
  - Rank students based on performance

- **Resource Hub**
  - Centralized learning materials
  - Categorized into:
    - Theory
    - Practice
    - Think

- **Upcoming Contests**
  - Keep members informed about upcoming coding competitions

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [MongoDB](https://www.mongodb.com/)
- **API:** [Codeforces API](https://codeforces.com/api/help)
- **Linting:** [ESLint](https://eslint.org/)

---

## ⚙️ Getting Started

Follow these instructions to get the project running locally.

### 📌 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18.x or later)  
  👉 https://nodejs.org/en/
- **npm** or **yarn**

### 📥 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd <repository-folder>
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Create a `.env.local` file in the root of the project and add the following variables:
   ```env
   MONGO_URL=<your-mongodb-connection-string>
   ADMIN_SECRET_CODE=<your-secret-code>
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
5. **Open in browser**
   ```bash
   http://localhost:3000
   ```

---

## 📖 API Endpoints

| Endpoint                      | Method | Description                                          |
| ----------------------------- | ------ | ---------------------------------------------------- |
| `/api/attendance`             | GET    | Fetches attendance data for all students.            |
| `/api/contests`               | GET    | Fetches the latest 100 finished contests.            |
| `/api/contests`               | POST   | Syncs the latest 100 contests with the database.     |
| `/api/custom-contests`        | POST   | Adds a new custom contest.                           |
| `/api/dashboard`              | GET    | Fetches dashboard statistics.                        |
| `/api/leaderboard`            | GET    | Fetches the leaderboard.                             |
| `/api/students`               | GET    | Fetches all students.                                |
| `/api/students`               | POST   | Creates a new student.                               |
| `/api/students/[id]`          | PUT    | Updates a student's information.                     |
| `/api/students/[id]`          | DELETE | Deletes a student.                                   |
| `/api/students/[id]/verify`   | POST   | Verifies and syncs a student's Codeforces data.      |
| `/api/topics`                 | GET    | Fetches a list of topics.                            |

---

## 🚀 Deployment

This application is ready to be deployed on [Vercel](httpsai.docs.vercel.com/deploy).

1. **Push your code to a Git repository.**
2. **Import your project into Vercel.**
3. **Set the environment variables** in the Vercel project settings.
4. **Deploy!**

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:** `git checkout -b my-new-feature`
3. **Make your changes.**
4. **Commit your changes:** `git commit -am 'Add some feature'`
5. **Push to the branch:** `git push origin my-new-feature`
6. **Submit a pull request.**

---


### 🗂️ Project Structure
 
``` 
.
├── public/                 # Static assets
│   └── screenshots/        # Project screenshots (used in README)
│
├── src/
│   ├── app/                # Application routes (Next.js App Router)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and shared logic
│   └── types/              # TypeScript type definitions
│
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration

```
