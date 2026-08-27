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
  };
  featured: boolean;
  year: string;
}

export const projects: Project[] = [
  {
    slug: 'mediatranscribe',
    title: 'MediaTranscribe',
    tagline: 'Transcription that never leaves your machine',
    description:
      'A self-hosted media transcription app built with Laravel and React. Upload audio or video, let it transcribe in the background, then edit the timestamped transcript and export it as SRT or plain text.',
    problem:
      'Every decent transcription tool wants you to upload your recording to someone else\'s server and pay by the minute. That\'s a hard sell when the audio is a client call, an interview, or anything you\'d rather not hand over.',
    solution:
      'I built a transcription app that runs entirely on your own machine. Whisper does the speech-to-text locally, FFmpeg pulls the audio out of video files, and a Redis-backed queue handles the long jobs so the browser never sits there waiting.',
    results: [
      'Local transcription with whisper.cpp, no external API',
      'FFmpeg audio extraction and validation, uploads up to 300 MB',
      'Background queue with live processing status',
      'Editable segments with timestamps, exported as SRT or TXT',
    ],
    techStack: ['Laravel', 'PHP', 'React', 'Inertia.js', 'PostgreSQL', 'Redis', 'FFmpeg', 'Whisper'],
    image: '/images/projects/mediatranscribe-dashboard.png',
    links: {
      github: 'https://github.com/Rabin-Pant/MediaTranscribe',
    },
    featured: false,
    year: '2026',
  },
  {
    slug: 'talentbridge',
    title: 'TalentBridge',
    tagline: 'A job portal that actually talks back',
    description:
      'A full-stack job portal connecting seekers and employers, with real-time messaging, job posting, and an admin dashboard behind it.',
    problem:
      'Job seekers spend hours applying into a black hole, and employers spend just as long sorting through applications that were never a fit. Nobody talks to anybody until an offer is already on the table.',
    solution:
      'I built a LinkedIn-style platform where messaging happens in real time, applications are tracked instead of lost, and admins can moderate the whole thing without digging through a database.',
    results: [
      'Three roles: seeker, employer, admin, each with a different view',
      'Real-time messaging with Socket.io',
      'Employer verification through document upload',
      'A social feed with posts, likes, and comments',
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Prisma', 'Socket.io', 'Tailwind CSS'],
    image: '/images/projects/TalentBridge-2.png',
    links: {
      github: 'https://github.com/Rabin-Pant/TALENTBRIDGE',
    },
    featured: true,
    year: '2025',
  },
  {
    slug: 'cinebook',
    title: 'CineBook',
    tagline: 'Movie tickets without the queue',
    description:
      'A movie ticket booking system built with Java JSP/Servlets, JDBC, and MySQL, with Khalti and eSewa payment built in.',
    problem:
      'Booking a movie ticket in Nepal usually meant showing up in person, or using a booking system with no real seat selection and payment tacked on as an afterthought.',
    solution:
      'I built a booking platform with a proper interactive seat map, both Khalti and eSewa for payment, and an admin dashboard for managing movies and showtimes.',
    results: [
      'Interactive seat map that updates live',
      'Khalti and eSewa payment gateways',
      'PDF tickets generated with iText',
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
    tagline: 'A messaging app I could actually self-host',
    description:
      'A real-time chat app built with Next.js, TypeScript, Socket.io, and PostgreSQL. Direct messages, group chats, and OAuth login.',
    problem:
      'Most self-hostable chat apps are either a pain to set up or missing basics like group chats and proper login. I wanted something simple enough to run myself.',
    solution:
      'I built a messaging app with passwordless OTP login, Google OAuth, group chats, emoji reactions, read receipts, and typing indicators, without dragging in a framework I\'d have to fight.',
    results: [
      'Email OTP and Google OAuth for login',
      'Real-time messaging with Socket.io',
      'Group chats with member roles',
      'Read receipts and typing indicators',
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