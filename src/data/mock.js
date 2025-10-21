import jasonportfolio from "../assets/jasonportfolio.png";
import zentry from "../assets/zentry.png";
import apple from "../assets/apple.png";
import baithak from "../assets/baithak.png";

export const personalInfo = {
  name: "Harrison King",
  title: "Creative Technologist & Digital Strategist",
  tagline: "Bridging creativity with cutting-edge technology",
  bio: "Multidisciplinary creative professional specializing in graphic design, web development, and digital experiences. Currently expanding into cybersecurity and AI-integrated applications, with a passion for crypto and future web technologies.",
  location: "Lagos, Nigeria",
  email: "kingharrisonariwodo@gmail.com",
  phone: "(+234) 903 816 3213",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
};

export const socialLinks = {
  github: "https://github.com/KingHarry001",
  linkedin: "www.linkedin.com/in/harrison-k-a-a5b118278",
  twitter: "https://x.com/NyxAsura",
  instagram: "https://www.instagram.com/nexusdesignsorg/",
};

export const skills = {
  design: [
    { name: "Logo Design", level: 95, category: "Graphic Design" },
    { name: "Brand Identity", level: 90, category: "Graphic Design" },
    { name: "UI/UX Design", level: 88, category: "Web Design" },
    { name: "Social Media Graphics", level: 85, category: "Graphic Design" },
  ],
  development: [
    { name: "HTML/CSS", level: 95, category: "Frontend" },
    { name: "JavaScript", level: 92, category: "Programming" },
    { name: "React.js", level: 90, category: "Frontend" },
    { name: "Next.js", level: 90, category: "Backend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 75, category: "Programming" },
  ],
  emerging: [
    { name: "Cybersecurity", level: 60, category: "Security" },
    { name: "Blockchain", level: 55, category: "Crypto" },
    { name: "AI Integration", level: 65, category: "AI/ML" },
  ],
};

export const services = [
  {
    id: 1,
    title: "Graphic Design",
    description:
      "Complete brand identity, logo design, and visual communication solutions",
    features: [
      "Logo & Brand Identity",
      "Marketing Materials",
      "Social Media Graphics",
      "Print Design",
    ],
    startingPrice: "$500",
    duration: "1-2 weeks",
    icon: "palette",
  },
  {
    id: 2,
    title: "Web Development",
    description:
      "Modern, responsive websites and web applications built with latest technologies",
    features: [
      "Custom Web Development",
      "React Applications",
      "E-commerce Sites",
      "API Integration",
    ],
    startingPrice: "$1,500",
    duration: "2-4 weeks",
    icon: "code",
  },
  {
    id: 3,
    title: "UI/UX Design",
    description:
      "User-centered design solutions that combine aesthetics with functionality",
    features: [
      "User Research",
      "Wireframing & Prototyping",
      "Design Systems",
      "Usability Testing",
    ],
    startingPrice: "$800",
    duration: "1-3 weeks",
    icon: "smartphone",
  },
  {
    id: 4,
    title: "cybersecurity",
    description:
      "Basic cybersecurity setup and consultation for small businesses and startups",
    features: [
      "Security Audits",
      "Best Practices Setup",
      "Security Consultation",
      "Training",
    ],
    startingPrice: "$300",
    duration: "1 week",
    icon: "shield",
  },
  {
    id: 5,
    title: "App Development",
    description:
      "Custom mobile and web applications built to scale your business with modern, user-friendly design and robust functionality.",
    features: [
      "Cross-Platform Development",
      "UI/UX Design",
      "API Integration",
      "Performance Optimization",
    ],
    startingPrice: "$300",
    duration: "1 week",
    icon: "smartphone",
  },
];

export const projects = [
  {
    id: 1,
    title: "Apple iPhone 15 Pro",
    description:
      "A modern product showcase website for the Apple iPhone 15 Pro, featuring smooth animations, 3D visuals, and a responsive design that highlights the phone's premium features and aesthetics.",
    fullDescription:
      "This premium product showcase website demonstrates the capabilities of the Apple iPhone 15 Pro through immersive 3D visuals and smooth animations. Built with cutting-edge web technologies, it features interactive product demonstrations, detailed specifications, and cinematic presentations that mirror Apple's design philosophy. The site showcases advanced GSAP animations, 3D product renders, and responsive design patterns.",
    category: "Dev",
    tags: ["3D", "UI/UX", "Product Showcase", "Gsap"],
    image: apple,
    liveUrl: "https://apple-iphone-jet.vercel.app/",
    githubUrl: "https://github.com/KingHarry001/apple-iphone-15-pro",
    featured: true,
    completionDate: "2024-01-20",
    clientName: "Personal Project",
    duration: "1 months",
    teamSize: 1,
    keyFeatures: [
      "Interactive 3D product visualization",
      "Smooth GSAP animations and transitions",
      "Responsive design across all devices",
      "Cinematic product presentations",
      "Performance optimized loading",
    ],
    challenges: [
      "Optimizing 3D models for web performance",
      "Creating smooth cross-browser animations",
      "Maintaining 60fps animation performance",
    ],
    results: [
      "98% performance score on Lighthouse",
      "Featured on design showcase platforms",
      "1000+ GitHub stars",
    ],
    gallery: [
      apple,
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=600&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Jason Photography Portfolio",
    description:
      "A sleek and modern photography portfolio showcasing Jason's work with smooth animations, interactive galleries, and an immersive user experience. Built with React, GSAP, OGL, and styled using Tailwind CSS for a clean and responsive design.",
    fullDescription:
      "An elegant photography portfolio that showcases professional work through immersive galleries and smooth interactions. The site features advanced WebGL effects using OGL, sophisticated image lazy loading, and fluid animations that enhance the viewing experience. Built with performance in mind, it delivers stunning visuals while maintaining fast load times and smooth navigation.",
    category: "Dev",
    tags: ["React", "Gsap", "Ogl", "Tailwind CSS"],
    image: jasonportfolio,
    liveUrl: "https://jason-photography-portfolio.vercel.app/",
    githubUrl: "https://github.com/KingHarry001/jason_photography_portfolio",
    featured: true,
    completionDate: "2024-02-15",
    clientName: "Jason Miller Photography",
    duration: "6 weeks",
    teamSize: 1,
    keyFeatures: [
      "WebGL-powered image effects",
      "Smooth scroll and parallax animations",
      "Optimized image gallery with lazy loading",
      "Mobile-first responsive design",
      "Contact form with validation",
    ],
    challenges: [
      "Implementing smooth WebGL transitions",
      "Optimizing large image assets",
      "Creating intuitive gallery navigation",
    ],
    results: [
      "50% increase in client inquiries",
      "95% mobile performance score",
      "Award-winning design recognition",
    ],
    gallery: [
      jasonportfolio,
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
    ],
  },
  {
    id: 3,
    title: "Zentry",
    description:
      "The Metagame, The Unified Play Layer Bridging Gaming, AI, and Blockchain | Zentry",
    fullDescription:
      "A futuristic gaming platform that bridges the gap between traditional gaming, AI, and blockchain technology. Zentry represents the next evolution of interactive entertainment, featuring a unified play layer that connects different gaming ecosystems. Built with modern web technologies and featuring cutting-edge animations and user interactions.",
    category: "Dev",
    tags: ["Gsap", "Sentry", "React", "Tailwind CSS", "React icons"],
    image: zentry,
    liveUrl: "https://zentry-psi.vercel.app/",
    githubUrl: "https://github.com/KingHarry001/zentry",
    featured: false,
    completionDate: "2024-01-10",
    clientName: "Zentry Gaming",
    duration: "3 months",
    teamSize: 2,
    keyFeatures: [
      "Immersive gaming interface design",
      "Complex animation sequences",
      "Real-time error monitoring with Sentry",
      "Responsive gaming dashboard",
      "Interactive UI components",
    ],
    challenges: [
      "Creating complex gaming animations",
      "Implementing real-time features",
      "Optimizing for gaming performance",
    ],
    results: [
      "10,000+ active beta users",
      "99.9% uptime achievement",
      "Featured in gaming publications",
    ],
    gallery: [
      zentry,
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop",
    ],
  },
  {
    id: 4,
    title: "Baithak",
    description:
      "Estate management system for real estate agents and property managers, featuring property listings, client management, and analytics.",
    fullDescription:
      "A comprehensive estate management platform designed for real estate professionals. Baithak streamlines property management workflows with intuitive listings management, client relationship tools, and detailed analytics. The platform features modern design patterns, smooth animations, and responsive layouts that work seamlessly across all devices.",
    category: "Dev",
    tags: ["Estate", "React", "Gsap", "Tailwind CSS"],
    image: baithak,
    liveUrl: "https://baithak-rho.vercel.app/",
    githubUrl: "https://github.com/yourusername/baithak",
    featured: false,
    completionDate: "2023-12-05",
    clientName: "Baithak Properties",
    duration: "4 months",
    teamSize: 3,
    keyFeatures: [
      "Property listings management",
      "Client relationship tools",
      "Analytics and reporting dashboard",
      "Mobile-responsive design",
      "Advanced search and filtering",
    ],
    challenges: [
      "Handling large property databases",
      "Creating intuitive search functionality",
      "Implementing real-time notifications",
    ],
    results: [
      "300% improvement in listing management efficiency",
      "75% reduction in administrative tasks",
      "200+ real estate agents onboarded",
    ],
    gallery: [
      baithak,
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    ],
  },
  {
    id: 5,
    title: "AI Content Generator",
    description:
      "Experimental AI-powered content generation tool with custom training models.",
    fullDescription:
      "An innovative AI-powered platform that generates high-quality content for various use cases. This experimental project explores the boundaries of artificial intelligence in content creation, featuring custom training models and advanced natural language processing capabilities. The tool demonstrates cutting-edge AI technology with an intuitive user interface.",
    category: "App",
    tags: ["AI", "Machine Learning", "Experimental"],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    liveUrl: "#",
    githubUrl: "https://github.com/yourusername/ai-content-generator",
    featured: true,
    completionDate: "2024-03-01",
    clientName: "Research Project",
    duration: "5 months",
    teamSize: 2,
    keyFeatures: [
      "Custom AI model training",
      "Multi-format content generation",
      "Real-time content optimization",
      "Advanced NLP processing",
      "Experimental UI patterns",
    ],
    challenges: [
      "Training stable AI models",
      "Handling computational complexity",
      "Creating intuitive AI interactions",
    ],
    results: [
      "Published research paper",
      "500% faster content generation",
      "90% accuracy in content quality",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&h=600&fit=crop",
    ],
  },
  {
    id: 6,
    title: "Restaurant Mobile App Design",
    description:
      "Complete UI/UX design for a restaurant mobile application with ordering system.",
    fullDescription:
      "A comprehensive mobile application design for a modern restaurant chain, featuring an intuitive ordering system, menu browsing, and customer loyalty features. The design emphasizes user experience with smooth interactions, appetizing food photography, and streamlined checkout processes. Created with a mobile-first approach and extensive user research.",
    category: "Design",
    tags: ["Mobile Design", "UI/UX", "Prototyping"],
    image:
      "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&h=400&fit=crop",
    liveUrl: "#",
    githubUrl: null,
    featured: false,
    completionDate: "2023-11-15",
    clientName: "TasteBud Restaurant Chain",
    duration: "8 weeks",
    teamSize: 2,
    keyFeatures: [
      "Intuitive menu navigation",
      "Streamlined ordering process",
      "Customer loyalty system",
      "Real-time order tracking",
      "Accessibility-focused design",
    ],
    challenges: [
      "Creating appetite-appealing visuals",
      "Simplifying complex ordering flows",
      "Ensuring accessibility compliance",
    ],
    results: [
      "40% increase in mobile orders",
      "95% user satisfaction rating",
      "Design system adopted across 50+ locations",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    ],
  },
  {
  id: 7,
  title: "Your Mobile App Name",
  description: "Your app description...",
  category: "App",
  tags: ["React Native", "Mobile", "Firebase"],
  image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=600&fit=crop",
  liveUrl: "https://youtu.be/YOUR_DEMO_VIDEO", // Video demo
  githubUrl: "https://github.com/yourusername/your-app",
  featured: true,
  gallery: [
      "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    ],
  // Add a note in fullDescription
  fullDescription: "...Download APK: [link] or watch demo video...",
},
];

export const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Cybersecurity: A Developer's Journey",
    excerpt:
      "My experience diving into cybersecurity fundamentals and essential tools every developer should know.",
    category: "Security",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    slug: "getting-started-cybersecurity-developer",
  },
  {
    id: 2,
    title: "Building Secure Web Applications in 2024",
    excerpt:
      "Best practices and modern approaches to web application security, including OWASP guidelines.",
    category: "Development",
    readTime: "12 min read",
    publishDate: "2024-01-08",
    slug: "building-secure-web-applications-2024",
  },
  {
    id: 3,
    title: "The Future of Web3 and Decentralized Applications",
    excerpt:
      "Exploring the potential of Web3 technologies and their impact on future web development.",
    category: "Crypto",
    readTime: "10 min read",
    publishDate: "2024-01-02",
    slug: "future-web3-decentralized-applications",
  },
  {
    id: 4,
    title: "Design Systems for Modern Web Applications",
    excerpt:
      "How to build scalable design systems that work across teams and projects.",
    category: "Design",
    readTime: "15 min read",
    publishDate: "2023-12-28",
    slug: "design-systems-modern-web-applications",
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Startup Founder",
    company: "TechFlow",
    content:
      "John delivered an exceptional brand identity that perfectly captured our startup's vision. His attention to detail and creative approach exceeded our expectations.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "InnovateLabs",
    content:
      "The web application John built for us is not only beautiful but also incredibly functional. His technical expertise and design skills make him a rare talent.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Marketing Director",
    company: "GrowthCo",
    content:
      "Working with John was a pleasure. He understood our needs perfectly and delivered a complete branding package that helped us stand out in our market.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
  },
];

export const certifications = [
  {
    id: 1,
    name: "CompTIA Security+ (In Progress)",
    issuer: "CompTIA",
    year: "2025",
    credentialUrl: "#",
  },
  {
    id: 2,
    name: "Graphics Design Certificate",
    issuer: "Canva",
    year: "2023",
    credentialUrl: "#",
  },
  {
    id: 3,
    name: "Google UX Design Certificate",
    issuer: "Google",
    year: "2022",
    credentialUrl: "#",
  },
  {
    id: 4,
    name: "UI/UX Design Certificate",
    issuer: "Figma",
    year: "2021",
    credentialUrl: "#",
  },
  {
    id: 5,
    name: "React Developer Certification",
    issuer: "Meta",
    year: "2021",
    credentialUrl: "#",
  },
];