// lib/projects.ts
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  results: string[];
  techStack: string[];
  image: string;
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  featured: boolean;
  year: string;
}

export const projects: Project[] = [
  {
    slug: 'talentbridge',
    title: 'TalentBridge',
    tagline: 'Connect Talent with Opportunity',
    description:
      'A full-stack job portal platform connecting job seekers with employers through real-time messaging, job posting, and an admin dashboard.',
    problem:
      'Job seekers struggle to find relevant opportunities, while employers waste time filtering through unqualified applications. Communication between both parties is fragmented.',
    solution:
      'Built a LinkedIn-inspired platform with real-time messaging, application tracking, social networking, and an admin dashboard for platform moderation.',
    results: [
      '3 user roles: Seeker, Employer, Admin',
      'Real-time messaging with Socket.io',
      'Employer verification with document upload',
      'Social feed with posts, likes, and comments',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Socket.io', 'Tailwind CSS'],
    image: '/images/projects/TalentBridge.png',
    links: {
      github: 'https://github.com/Rabin-Pant/TALENTBRIDGE',
    },
    featured: true,
    year: '2025',
  },
  {
    slug: 'cinebook',
    title: 'CineBook',
    tagline: 'Online Movie Ticket Booking System',
    description:
      'A full-stack web-based movie ticket booking system built with Java JSP/Servlets, JDBC, and MySQL with Khalti and eSewa payment integration.',
    problem:
      'Movie ticket booking in Nepal often requires visiting the cinema hall in person or using fragmented systems without proper seat selection and payment integration.',
    solution:
      'Built a comprehensive booking platform with interactive seat selection, dual payment gateway support (Khalti + eSewa), and an admin dashboard for managing movies and showtimes.',
    results: [
      'Interactive live seat map selection',
      'Khalti + eSewa payment gateway integration',
      'PDF ticket generation with iText',
      'Admin dashboard with revenue analytics',
    ],
    techStack: ['Java', 'JSP', 'Servlets', 'MySQL', 'JDBC', 'HTML/CSS', 'JavaScript'],
    image: '/images/projects/cinebook.png',
    links: {
      github: 'https://github.com/Rabin-Pant/CineBook-Online-Movie-Ticket-Booking-System',
    },
    featured: true,
    year: '2025',
  },
  {
    slug: 'chat-app',
    title: 'Chat App',
    tagline: 'Real-Time Messaging Platform',
    description:
      'A full-stack real-time chat application built with Next.js, TypeScript, Socket.io, and PostgreSQL supporting direct messaging, group chats, and OAuth.',
    problem:
      'Existing chat applications are either too complex for developers to self-host or lack essential features like group chats, reactions, and OAuth integration.',
    solution:
      'Built a feature-rich messaging platform with passwordless OTP login, Google OAuth, group chats, emoji reactions, read receipts, and typing indicators.',
    results: [
      'Email OTP + Google OAuth authentication',
      'Real-time messaging with Socket.io',
      'Group chats with member roles',
      'Read receipts + typing indicators',
    ],
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Socket.io', 'Tailwind CSS'],
    image: '/images/projects/chat-app.png',
    links: {
      github: 'https://github.com/Rabin-Pant/Chat-App',
      live: 'https://chat-app-psi-ecru-73.vercel.app',
    },
    featured: true,
    year: '2025',
  },
];

export const getFeaturedProjects = (): Project[] => {
  return projects.filter((project) => project.featured);
};

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find((project) => project.slug === slug);
};