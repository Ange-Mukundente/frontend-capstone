# 🌿 VetConnect Rwanda - Frontend

<div align="center">

**Smart Veterinary Appointment Booking Platform for Rwanda**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/anges-projects-bae26f2c/v0-greeting)

[Live Demo](https://vercel.com/anges-projects-bae26f2c/v0-greeting) • [Report Bug](https://github.com/yourusername/vetconnect-rwanda/issues) • [Request Feature](https://github.com/yourusername/vetconnect-rwanda/issues)

</div>

---

## 📋 Table of Contents

| Section                                                | Description                 |
| ------------------------------------------------------ | --------------------------- |
| [About](#about)                                        | Platform overview           |
| [Mission & Impact](#mission--impact)                   | Goals & outcomes            |
| [Features](#features)                                  | Core functionalities        |
| [Tech Stack](#tech-stack)                              | Technologies used           |
| [Folder Structure](#folder-structure)                  | Organized project structure |
| [Getting Started](#getting-started)                    | How to run locally          |
| [Environment Variables](#environment-variables)        | Config info                 |
| [Scripts](#available-scripts)                          | Commands                    |
| [Deployment](#deployment)                              | Vercel & others             |
| [Contributing](#contributing)                          | How to contribute           |
| [License & Acknowledgments](#license--acknowledgments) | Credits                     |

---

## 🎯 About

VetConnect Rwanda is a **digital platform connecting farmers with veterinarians**, enabling:

- Real-time appointment booking
- Livestock health record management
- SMS and web notifications

**Goal:** Reduce livestock mortality and improve rural veterinary access.

---

## 🌟 Mission & Impact

**Mission:** Enhance Rwanda’s livestock health services digitally, supporting Vision 2050.

| Metric                                    | Target |
| ----------------------------------------- | ------ |
| Reduction in preventable livestock deaths | 🎯 25% |
| Faster appointment booking                | ⚡ 40% |
| Vaccination adherence                     | 💉 35% |

---

## ✨ Features

### 🏠 Landing Page

- Mobile-first, responsive design
- Hero section with CTA
- Feature showcase & testimonials

### 📅 Appointment Booking

- Check veterinarian availability
- Emergency prioritization
- Track booking status
- SMS & web booking

### 🐄 Livestock Management

- Individual animal health records
- Vaccination & medical history
- Health monitoring & alerts

### 🔔 Notifications

- Automated reminders & alerts
- SMS integration for rural users

### 👨‍⚕️ Veterinarian Network

- Browse certified vets by district
- View ratings & specialties
- Book directly from the platform

---

## 🛠️ Tech Stack

| Tech               | Purpose                         |
| ------------------ | ------------------------------- |
| **Next.js 15**     | React framework with App Router |
| **TypeScript**     | Type-safe development           |
| **Tailwind CSS 4** | Utility-first styling           |
| **shadcn/ui**      | Prebuilt UI components          |
| **Lucide Icons**   | Modern icon library             |
| **Inter Font**     | Readable typography             |
| **Vercel**         | Hosting & deployment            |

---

## 📁 Folder Structure

```bash
vetconnect-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── auth/          # login, register, forgot-password
│   │   └── dashboard/     # farmer, vet, admin dashboards
│   ├── components/
│   │   ├── ui/             # shadcn/ui
│   │   ├── layout/         # header/footer/sidebar
│   │   ├── auth/           # login/register forms
│   │   ├── appointments/
│   │   └── livestock/
│   ├── lib/                # utilities, API client
│   ├── hooks/              # custom hooks
│   ├── types/              # TypeScript types
│   └── config/             # site & API configuration
├── public/                 # images, favicon
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x+
- npm / pnpm / yarn

### Installation

```bash
git clone https://github.com/Ange-Mukundente/frontend-capstone.git
cd frontend-capstone
npm install  # or pnpm install / yarn install
```

### Environment Variables

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_ENABLE_SMS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📜 Available Scripts

| Command              | Purpose                 |
| -------------------- | ----------------------- |
| `npm run dev`        | Start dev server        |
| `npm run build`      | Build production        |
| `npm run start`      | Start production server |
| `npm run lint`       | ESLint check            |
| `npm run type-check` | TypeScript check        |
| `npm run format`     | Prettier formatting     |

---

## 🌐 Deployment

### Vercel

1. Push code to GitHub
2. Import repository into [Vercel](https://vercel.com/)
3. Set `.env` variables
4. Click **Deploy**

✅ Automatic deployments on every `main` branch push

---

## 🎨 Design System

- **Primary:** Green `#16a34a`
- **Accent:** Yellow `#eab308`
- **Typography:** Inter font, line-height 1.5–1.6

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push branch & open PR

---

## 📝 License & Acknowledgments

- MIT License
- Rwanda Agriculture & Animal Resources Development Board (RAB)
- Ministry of Agriculture (MINAGRI)
- Feedback from local farmers & veterinarians

---

<div align="center">

Author: Ange Mukundente<angemukundente@gmail.com>

</div>
