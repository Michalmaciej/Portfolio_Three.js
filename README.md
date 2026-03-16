# Michał Maciej — Portfolio

A personal portfolio website built with React, Three.js and TailwindCSS. Features 3D models, interactive animations, a contact form with EmailJS integration, and a fully responsive mobile layout.

**Live:** [michalmaciej.com](https://www.michalmaciej.com)

---

## Features

- **Animated intro** — iPhone 3D model slides in on load with a video playing on the screen, then shrinks into the corner
- **Interactive 3D Rubik's Cube** — fully functional cube with face rotations, scramble and reset, drag-to-orbit
- **Interactive chess piece** — 3D chess piece in the Contact section, draggable
- **Dark / light mode** — smooth curtain transition animation
- **Contact form** — EmailJS integration, sends directly to inbox with animated send feedback
- **CV download** — PDF available directly from the contact section
- **Responsive** — mobile hamburger navbar, stacked layouts on small screens
- **Scroll animations** — per-element IntersectionObserver with play-once-stay pattern
- **Lazy Three.js init** — WebGL scenes initialize only when near the viewport

---

## Sections

| Section | Description |
|---|---|
| Hero | Name, cycling role titles, CTA button |
| About | Overview, bio, interest cards with hover effects |
| Education | Animated timeline — B.Sc. and M.Sc. |
| Work | Job cards with responsibilities |
| Skills | Tech stack chips — ML/AI, Web, Tools |
| Projects | Project cards with images, tags, GitHub and live links |
| Contact | EmailJS form + interactive 3D chess piece |

---

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | React 18, TypeScript |
| Build tool | Vite |
| Styling | TailwindCSS v4 |
| 3D / WebGL | Three.js, GLTFLoader, RoomEnvironment |
| Email | EmailJS (`@emailjs/browser`) |
| 3D Models | Blender (iPhone, chess piece) |
| Fonts | Syne, Space Grotesk (Google Fonts) |

---

## Project Structure

```
src/
├── assets/
│   ├── models/          # .glb 3D models (iPhone, chess piece)
│   └── projects/        # Project preview images
├── components/
│   ├── IPhoneScene.tsx      # Intro 3D iPhone animation + video screen
│   ├── Navbar.tsx           # Sidebar (desktop) / hamburger (mobile)
│   ├── HeroSection.tsx
│   ├── AboutSection.tsx
│   ├── EducationSection.tsx
│   ├── WorkSection.tsx
│   ├── SkillsSection.tsx
│   ├── RubiksCubeSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ContactSection.tsx   # EmailJS form + chess canvas
│   ├── BackgroundScene.tsx  # Floating orb background
│   └── LoadingScreen.tsx
├── hooks/
│   └── useIsMobile.ts       # Responsive breakpoint hook
├── App.tsx
└── index.css
public/
├── hello.mp4               # Intro screen video
├── mess.mp4                # Secondary screen video (2x speed)
├── aparat.PNG              # Final screen image
└── michal_maciej_CV.pdf
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

Output goes to `dist/`. Upload the contents of `dist/` along with files from `public/` to your web server.

### Preview production build

```bash
npm run preview
```

---

## Deployment (Hostinger / Apache)

Upload the contents of `dist/` to `public_html`. Also upload the files from `public/` (videos, PDF, images). Add a `.htaccess` file to handle SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Contact

- **Email:** mich.kowa.01@gmail.com
- **Website:** [michalmaciej.com](https://www.michalmaciej.com)
- **GitHub:** [github.com/Michalmaciej](https://github.com/Michalmaciej)
