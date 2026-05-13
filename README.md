# CampusZen — Student Financial & Academic Management Platform

A production-ready fullstack application for university students to manage courses, tasks, and expenses with professional financial insights.

**Stack:** Next.js 16 · TypeScript 5 · React 19 · Tailwind CSS · Framer Motion · Supabase Postgres · RLS Security

**Live Demo:** https://proyecto-1082928103-ueat-86vha82pz-lianna-mora01s-projects.vercel.app

**Repository:** https://github.com/Lianna-Mora01/Proyecto_1082928103

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier okay)

### Setup Steps

```bash
# 1. Clone and install
git clone <repo>
cd Proyecto\ lianna
npm install

# 2. Configure Supabase (REQUIRED)
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
# See SETUP_SUPABASE.md for detailed instructions

# 3. Verify setup
npm run verify-supabase

# 4. Start development server
npm run dev

# 5. Open browser and bootstrap database
# Go to: http://localhost:3000/admin/db-setup
```

**Status Check:**
```bash
npm run type-check    # TypeScript validation
npm run validate      # Full build validation
```

> 📋 **Detailed Setup Checklist:** See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) to verify all steps

---

## 🎯 Features

✅ **Authentication** — Login/Register with JWT + Postgres RLS  
✅ **Course Management** — Create, organize, and track subjects  
✅ **Task Management** — Create tasks with priority, due dates, and urgency alerts  
✅ **Financial Tracking** — Track expenses by category with budgets  
✅ **Reports & Analytics** — Visualize spending and academic progress  
✅ **Responsive Design** — Mobile-first UI with Tailwind CSS  
✅ **Animations** — Framer Motion for smooth UX  
✅ **Security** — Row-Level Security (RLS) on all data  
✅ **Automated Deployment** — GitHub → Vercel CI/CD pipeline  

---

## 📁 Project Structure

```
my-project/
├── app/                          # Next.js App Router
│   ├── api/data/route.ts        # JSON data endpoint
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # Reusable React components
│   └── HolaMundo.tsx            # Animated home component
│
├── data/                         # JSON-based "database"
│   ├── content.json             # Page content
│   ├── config.json              # App configuration
│   └── README.md                # Data schema documentation
│
├── lib/                          # TypeScript utilities
│   ├── types.ts                 # Interfaces and types
│   └── data-reader.ts           # Helper functions
│
├── public/                       # Static assets
│
├── .prettierrc                  # Prettier formatting config
├── .eslintrc.json              # ESLint rules
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript config
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000) with hot-reloading.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Run ESLint (auto-fix enabled) |
| `npm run type-check` | Run TypeScript type checking |
| `npm run validate` | Run type-check + build |

---

## 🔄 Data Access Pattern

Server-side only. The `/data` folder is never exposed to the browser.

**Server-side component (app/page.tsx):**
```typescript
import { getContent } from "@/lib/data-reader";

export default function Home() {
  const content = getContent();
  return <MyComponent content={content} />;
}
```

**Client-side component receives data as props (never reads JSON):**
```typescript
"use client";

interface Props {
  content: SiteContent;
}

export default function MyComponent({ content }: Props) {
  return <div>{content.home.greeting}</div>;
}
```

---

## 🌐 API Endpoint

**GET /api/data** — Returns all content and configuration

```bash
curl https://proyecto-1082928103-ueat-86vha82pz-lianna-mora01s-projects.vercel.app/api/data
```

Response:
```json
{
  "content": {
    "home": {
      "greeting": "Hola Mundo",
      "subtitle": "Pipeline CI/CD validado ✓",
      "version": "1.0.1"
    },
    "meta": { "title": "...", "description": "..." }
  },
  "config": {
    "app": { "name": "...", "theme": "dark", "language": "es" },
    "animation": { "enabled": true, "duration": 0.8, "easing": "easeInOut" }
  }
}
```

---

## 🔄 CI/CD Pipeline

**Auto-deploy from GitHub:**

```
git push origin main
  ↓ GitHub webhook
  ↓ Vercel detects changes
  ↓ Automatic build (npm run build)
  ↓ Deploy to production
  ↓ Live at https://proyecto-1082928103-ueat-86vha82pz-lianna-mora01s-projects.vercel.app
```

**Preview deployments for feature branches:**

```
git push origin feature/name
  ↓ Vercel generates preview URL
  ↓ https://proyecto-...-git-feature-name-...vercel.app
```

---

## 📊 Code Quality Standards

### Type Safety

```bash
npm run type-check
```

No TypeScript errors allowed. Full strict mode enabled.

### Formatting

```bash
npm run format
```

Auto-formats code with Prettier (80 character line width, 2-space indentation).

### Linting

```bash
npm run lint
```

ESLint configuration extends Next.js best practices and Prettier compatibility.

### Full Validation

```bash
npm run validate
```

Runs type-check + build to ensure everything is production-ready.

---

## 🚀 Deployment

Deployed on **Vercel** with automatic CI/CD from GitHub.

1. Changes pushed to `main` branch automatically deploy to production
2. Pull requests generate preview URLs for testing
3. Rollback to previous deployments if needed from Vercel dashboard

**No additional configuration required** — GitHub webhooks and Vercel integration handle everything automatically.

---

## 🛡 Security Considerations

- ✅ JSON data files are **server-side only** and never exposed to client
- ✅ Environment variables stored in `.env.local` (project-level, not committed)
- ✅ `.env.example` provided as template for new developers
- ✅ No hardcoded secrets in code or JSON files

---

## 📖 Documentation

- **Data Structure:** See `/data/README.md`
- **Type Definitions:** See `/lib/types.ts`
- **Infrastructure:** See `../Doc/INFRASTRUCTURE_PLAN.md`
- **Implementation:** See `../Doc/IMPLEMENTATION_PLAN.md`

---

## 🔧 Technology Rationale

| Tech | Why |
|------|-----|
| **Next.js 14** | Modern React framework w/ App Router, SSR, API Routes |
| **TypeScript 5** | Type safety, better DX, fewer bugs in production |
| **Tailwind CSS** | Rapid styling, consistent design system |
| **Framer Motion** | Smooth animations without custom CSS |
| **JSON Data Layer** | Simple, version-controllable content (no database setup) |
| **Vercel** | Zero-config deployment, automatic scaling, global CDN |

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

## 📝 License

This project is provided as an example implementation.

---

## 👤 Author

Created as a complete fullstack example demonstrating modern web development practices.

**Commit:** `8209106`  
**Build Status:** ✅ Production Ready  
**Last Updated:** 9 de abril de 2026
