# DermaAI - AI-Powered Skin Analysis Platform

<div align="center">

![DermaAI Logo](https://img.shields.io/badge/DermaAI-AI%20Powered%20Skin%20Analysis-blue?style=for-the-badge&logo=react)

**Advanced AI-powered dermatological analysis platform providing instant skin condition insights and personalized treatment recommendations**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Live Demo](https://lovable.dev/projects/6fb8a2c5-62b3-4c0b-af67-ae37fc80b5ae) • [Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started)

</div>

---

## 🚀 Overview

**DermaAI** is a cutting-edge web application that leverages artificial intelligence to provide professional-grade dermatological analysis. Users can upload skin photos and receive instant, comprehensive assessments including condition identification, risk assessment, treatment recommendations, and product suggestions.

## ✨ Features

### 🔬 AI-Powered Analysis
- **Instant Skin Assessment**: Upload photos and get real-time AI analysis via Groq
- **Condition Detection**: Identify various skin conditions with confidence scoring
- **Risk Level Assessment**: Categorized risk levels (Low/Medium/High)
- **Professional Insights**: Medical-grade analysis with accessible language
- **Client-Side Processing**: All AI analysis happens directly in your browser

### 📱 User Experience
- **Drag & Drop Interface**: Intuitive image upload with drag-and-drop support
- **Real-time Processing**: Instant analysis with progress indicators
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional UI**: Medical-grade interface built with modern design principles

### 🎯 Comprehensive Results
- **Detailed Analysis**: Condition description, causes, and recommendations
- **Treatment Guidance**: Personalized skincare advice and product suggestions
- **Medical Disclaimer**: Professional medical guidance and safety information
- **Product Recommendations**: Curated product suggestions for specific conditions
- **Risk Assessment**: Confidence scoring and risk level categorization
- **Educational Content**: In-depth explanations in accessible language

### 📚 Educational Platform
- **Expert Blog Content**: Professional dermatological insights and articles
- **Skincare Education**: Evidence-based tips and myth debunking
- **Seasonal Guidance**: Year-round skincare adaptation advice
- **Research Insights**: Latest developments in dermatology and AI
- **Authoritative Sources**: Content from board-certified dermatologists
- **Interactive Learning**: Engaging articles with practical applications

### 🌍 Global Reach & Support
- **Multi-Location Support**: Offices in New York, London, and Singapore
- **24/7 AI Assistance**: Round-the-clock AI-powered support
- **Professional Team**: Medical advisors and AI development experts
- **Contact Channels**: Multiple ways to reach our support team


## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.8.3** - Type-safe development experience
- **Vite 5.4.19** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives

### AI & External Services
- **Groq SDK 0.30.0** - AI model integration for skin analysis
- **YouTube API** - Educational video content integration
- **RapidAPI** - Product recommendations and data

### Development Tools
- **ESLint 9.32.0** - Code quality and consistency
- **Prettier** - Code formatting and style enforcement
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Concurrently** - Run multiple commands simultaneously

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager
- **Groq API Key** (for AI analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dermaai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```bash
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_PRODUCTS_API_KEY=your_rapidapi_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
dermaai/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   ├── Header.tsx     # Navigation header with routing
│   │   ├── HeroSection.tsx # Landing page hero section
│   │   ├── UploadSection.tsx # Image upload & AI analysis
│   │   ├── ResultsSection.tsx # Analysis results display
│   │   ├── AboutSection.tsx # Company information & team
│   │   ├── BlogsSection.tsx # Educational blog content
│   │   ├── ContactSection.tsx # Contact forms & support
│   │   ├── Footer.tsx     # Site footer & links
│   │   └── ...            # Additional UI components
│   ├── pages/             # Page components & routing
│   │   ├── Index.tsx      # Home page
│   │   ├── About.tsx      # About page
│   │   ├── Blogs.tsx      # Blog listing page
│   │   ├── BlogPost.tsx   # Individual blog post
│   │   ├── Contact.tsx    # Contact page
│   │   └── Analyze.tsx    # Dedicated analysis page
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions & helpers
│   └── assets/            # Static assets & images
├── public/                 # Public static files
└── package.json            # Dependencies & scripts
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend development server (port 8080) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

## 🌐 Application Routes

### Frontend Pages
- `/` - Home page with hero section, upload, and featured content
- `/analyze` - Dedicated analysis page with enhanced features
- `/about` - Company information, mission, vision, and team
- `/blogs` - Educational blog content and dermatological insights
- `/blog/:id` - Individual blog post with full content
- `/contact` - Contact forms and support information

## 🎨 UI Components

The application uses a comprehensive set of UI components built with **shadcn/ui** and **Radix UI**:

- **Form Components**: Inputs, buttons, checkboxes, radio groups
- **Layout Components**: Cards, containers, grids, navigation
- **Feedback Components**: Toasts, alerts, progress indicators
- **Data Display**: Tables, lists, badges, avatars
- **Interactive Elements**: Modals, tooltips, dropdowns, tabs

## 📚 Content & Educational Features

### Blog System
- **Expert Articles**: Professional dermatological insights from board-certified dermatologists
- **Categories**: AI Technology, Skincare Tips, Telemedicine, Seasonal Care, Acne Treatment, Anti-Aging
- **Rich Content**: Featured images, author information, read time estimates, and engagement metrics
- **Search & Filter**: Easy navigation through educational content

### About Section
- **Company Mission**: Making skin health information accessible through AI technology
- **Team Information**: Medical advisors, AI development leads, and clinical researchers
- **Statistics**: User count, accuracy rates, global reach, and support availability
- **Core Values**: Precision, patient-centered care, innovation, and privacy

### Contact & Support
- **Multi-Location Support**: Offices in New York, London, and Singapore
- **Contact Forms**: Easy-to-use forms for inquiries and support requests
- **Multiple Channels**: Email, phone, and contact form options
- **Response Time**: 24-hour response guarantee for all inquiries

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GROQ_API_KEY` | Groq API key for AI analysis | Yes |
| `VITE_PRODUCTS_API_KEY` | RapidAPI key for product data | No |
| `VITE_YOUTUBE_API_KEY` | YouTube API key for videos | No |

## 🚀 Deployment



### Custom Domain
1. Navigate to **Project → Settings → Domains**
2. Click **Connect Domain**
3. Follow the DNS configuration instructions

### Self-Hosting
1. Build the production bundle: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables on your hosting platform

## 🤝 Contributing

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Quality
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- **Issues**: Create an issue in this repository
- **Community**: Join our [Discord community](https://discord.gg/lovable)

---

<div align="center">

**Built with ❤️ using modern web technologies**

</div>
