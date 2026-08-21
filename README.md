# 🎬 Filmzy — Modern Movie & TV Discovery Web Application

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.5-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

---

## 🚀 Overview

**Filmzy** is a state-of-the-art cinema and TV series web application built with **Next.js 15 App Router**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Firebase**. It features a modern obsidian dark glassmorphism design system, real-time debounced autocomplete search, interactive pop-up trailer playback, mood-based playlists, release countdown timers, random movie roll dice, and personalized watchlist status tracking with cross-device syncing.

---

## ✨ Features & Functionality

### 🌟 1. Cinema Hero Spotlight & Discovery
- **Hero Spotlight Banner**: Dynamic backdrop wallpaper with cinematic vignette gradients, IMDb rating badges, release dates, story synopsis, and direct trailer pop-up action triggers.
- **Netflix / Apple TV+ Style Responsive Grid**: Standardized 4-column desktop grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6`) giving poster artwork breathing room and clear title display.
- **1:1 Skeleton Loaders (`MovieCardSkeleton`)**: Pixel-perfect skeleton loading state matching exact poster aspect ratios (`aspect-[2/3]`), heart button position, rating overlay, and typography to eliminate Cumulative Layout Shift (CLS).

### 🔍 2. Real-Time Search & Autocomplete
- **Live Autocomplete Dropdown**: Instant search bar in the main header featuring debounced recommendations with poster thumbnails, title, release year, and IMDb score.
- **Interactive Search Page (`/search`)**: Dedicated discovery page with live search bar, genre pills (`Action`, `Sci-Fi`, `Comedy`, `Horror`, `Drama`, etc.), and popular tag shortcuts.
- **Advanced Filter Bar (`AdvancedFilterBar`)**: Filter by **Minimum IMDb Score** (`7.0+`, `8.0+`, `8.5+ Masterpieces`), **Release Era** (`2020s`, `2010s`, `2000s`, `90s & Older`), and sorting (`Most Popular`, `Highest Rating`, `Newest`).

### 🎬 3. Interactive Pop-up Trailer Modal (`TrailerModal`)
- **Watch Trailers Anywhere**: Click "Watch Trailer" from any movie card on hover, the Hero Spotlight banner, or movie details pages.
- **Top-Level Stacking (`React.createPortal`)**: Portaled directly to `document.body` with `z-[9999]` stacking to sit above sticky headers with backdrop blur overlay and `Escape` key dismissal.

### 🎲 4. "Surprise Me!" Random Movie Picker (`SurpriseMeModal`)
- **Random Movie Wheel**: Hit the **"Surprise Me 🎲"** button in desktop or mobile navigation to roll the movie dice and discover random top-rated blockbusters with a compact preview layout.

### 🏆 5. Personal Watch Status Tracker (`/favourite`)
- **Watchlist Organization**: Organize saved titles in your personal collection under 3 watch statuses:
  - 📌 **Plan to Watch**
  - 🍿 **Currently Watching**
  - 🏆 **Completed**
- **Status Filter Tabs**: Filter watchlist items dynamically by status pills with real-time Firestore persistence.

### 🍿 6. Mood-Based Binge Playlists & Upcoming Countdowns
- **Mood Playlists (`MoodPlaylists`)**: Curated movie collections tailored to your current vibe on the Home page (*Adrenaline Rush ⚡*, *Mind-Bending Sci-Fi 🧠*, *Late Night Thrillers 🌙*, *Feel Good Comedies 😂*, *Epic Storytelling 📜*).
- **Upcoming Premiere Countdowns (`UpcomingCountdowns`)**: Live release countdown timers ("Releasing in X Days") for upcoming worldwide theater premieres with one-click reminder setting.

### 🎨 7. Theme Accent Customizer (`ThemeAccentContext`)
- **Personalized Accent Colors**: Switch your UI theme accent dynamically in **Profile Settings** (`/profile`) between **Crimson Red**, **Cyberpunk Purple**, **Neon Cyan**, and **Amber Gold** with persistent `localStorage` saving.

### 🔢 8. Fluid Interactive Pagination (`PaginationControls`)
- **Numbered Page Navigation**: Interactive page pills (`[1] [2] [3] ... [500]`), first/last page jump buttons, and smooth auto-scroll to top when switching pages.

### 🔒 9. Firebase Authentication & Profile Management
- **User Authentication**: Secure Sign-Up, Login, and Password Reset using Firebase Auth.
- **Profile Dashboard (`/profile`)**: Avatar update, display name customization, password security updates, and sign-out controls.
- **Cross-Device Syncing**: Favorites and watchlist status sync seamlessly across desktop and mobile devices.

### 🦶 10. Footer Component (`Footer`)
- Dark glassmorphic footer featuring brand logo, quick navigation links, account shortcuts, category filters, social icons, and TMDB API attribution notice.

---

## 🛠 Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 15 (App Router)** | Framework & Server Components |
| **React 19 & TypeScript** | Component Architecture & Type Safety |
| **Tailwind CSS v4** | Utility-First Styling & Glassmorphism Design System |
| **Framer Motion** | Micro-Animations & Page Transitions |
| **Firebase Auth & Firestore** | Authentication & Real-Time Watchlist Database |
| **TMDB API** | Movie Data, Posters, Trailers, & Category Feeds |
| **Sonner** | Modern Toast Notification System |
| **Lucide React** | UI Icon System |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/MuritalaAhmed05/HNGx-stage8-movie-app.git
cd HNGx-stage8-movie-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and configure your credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── (auth)/                  # Login, Register, & Reset Password pages
│   ├── (movie)/                 # Main application routes
│   │   ├── page.tsx             # Home Page (Spotlight, Playlists, Countdowns)
│   │   ├── movies/page.tsx      # Movies Catalog with Category Filters & Pagination
│   │   ├── tv-shows/page.tsx    # TV Series Catalog & Pagination
│   │   ├── search/page.tsx      # Search Page with Advanced Filters & Sorting
│   │   ├── favourite/page.tsx   # Watchlist Page with Watch Status Tracker
│   │   ├── profile/page.tsx     # Profile Dashboard & Theme Accent Customizer
│   │   └── movie/[id]/page.tsx  # Detailed Movie Page with Cast & Trailer
│   ├── firebase.ts              # Build-safe Firebase configuration
│   └── service/                 # TMDB API service layer & genre mapping
├── components/
│   ├── Header.tsx               # Translucent Navigation Bar & Live Search Autocomplete
│   ├── Footer.tsx               # Modern Footer with Attribution & Quick Links
│   ├── MovieCard.tsx            # Poster Card with Quick Trailer Play Overlay
│   ├── MovieCardSkeleton.tsx    # 1:1 Aspect Ratio Skeleton Loader
│   ├── TrailerModal.tsx         # Top-level Portaled YouTube Trailer Pop-up
│   ├── SurpriseMeModal.tsx      # Random Movie Picker Dice Wheel
│   ├── AdvancedFilterBar.tsx    # IMDb Score & Release Era Filter Bar
│   ├── PaginationControls.tsx   # Fluid Numbered Page Navigation
│   ├── MoodPlaylists.tsx        # Curated Mood-Based Playlists
│   ├── UpcomingCountdowns.tsx   # Upcoming Release Countdowns
│   └── ThemeAccentContext.tsx   # Dynamic Theme Accent Color Provider
└── public/
    └── logo.png                 # Filmzy Brand Logo Asset
```

---

## 📄 License

This project is open-source and available under the **MIT License**.
*This product uses the TMDB API but is not endorsed or certified by TMDB.*
