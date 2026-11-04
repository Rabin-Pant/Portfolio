# Rabin Pant portfolio

A Next.js portfolio built with React, TypeScript, Tailwind CSS, and Framer Motion.

The design uses white and pale blue sections, readable dark text, the #0A5C8E accent, an RP favicon, and Fraunces, Inter, and JetBrains Mono typography. The hero renders immediately without an entrance animation. Only heading and body fonts are preloaded.

## Project structure

- `app/`: page routes, layout, favicon, and shared CSS.
- `components/home/`: homepage sections in their existing order.
- `components/projects/`: project cards, detail views, and listing UI.
- `components/ui/`: navigation, footer, and social icons.
- `lib/projects.ts`: shared project data.
- `lib/profile.ts`: shared profile URLs and resume path.
- `lib/skills.ts`: shared language, database, and cloud-service lists used by the skill displays and statistics.
- `public/`: the resume, two portraits, and four project screenshots used by the site.

The homepage presents Hero, About, Experience, Skills, Certifications, Projects, Contact, and Footer. About contains My Journey and Future Goals. All four personal projects remain on the homepage, with “How I built it” and “What it does” sections; `/projects` and `/projects/[slug]` provide the existing listing and detail routes.

## Local development

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.local` for the browser-based contact form. Set the same variable in the deployment environment before building. Local environment files must not be committed.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

ESLint rejects unused imports, locals, and parameters in application code. TypeScript checks types and imports, including generated route definitions. Dependency versions are pinned by `package-lock.json`.

Check the desktop and mobile layouts, both About tabs, section navigation, all project routes, resume access, and contact-form feedback before deployment. Mock contact-form responses during testing so no test messages are sent.

For LCP measurements, stop the development server and run `npm start` after building. Compare measurements at the same viewport, cache, CPU, and network settings.
