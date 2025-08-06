// Mock data for portfolio website

export const personalInfo = {
  name: "Harrison King",
  title: "Creative Technologist & Digital Strategist",
  tagline: "Bridging creativity with cutting-edge technology",
  bio: "Multidisciplinary creative professional specializing in graphic design, web development, and digital experiences. Currently expanding into cybersecurity and AI-integrated applications, with a passion for crypto and future web technologies.",
  location: "Lagos, Nigeria",
  email: "kingharrisonariwodo@gmail.com",
  phone: "(+234) 903 816 3213",
  // profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
};

export const socialLinks = {
  github: "https://github.com/KingHarry001",
  linkedin: "www.linkedin.com/in/harrison-k-a-a5b118278",
  twitter: "https://x.com/NyxAsura",
  instagram: "https://www.instagram.com/nexusdesignsorg/"
};

export const skills = {
  design: [
    { name: "Logo Design", level: 95, category: "Graphic Design" },
    { name: "Brand Identity", level: 90, category: "Graphic Design" },
    { name: "UI/UX Design", level: 88, category: "Web Design" },
    { name: "Social Media Graphics", level: 85, category: "Graphic Design" }
  ],
  development: [
    { name: "HTML/CSS", level: 95, category: "Frontend" },
    { name: "JavaScript", level: 92, category: "Programming" },
    { name: "React.js", level: 90, category: "Frontend" },
    { name: "Next.js", level: 90, category: "Backend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 75, category: "Programming" }
  ],
  emerging: [
    { name: "Cybersecurity", level: 60, category: "Security" },
    { name: "Blockchain", level: 55, category: "Crypto" },
    { name: "AI Integration", level: 65, category: "AI/ML" }
  ]
};

export const services = [
  {
    id: 1,
    title: "Graphic Design",
    description: "Complete brand identity, logo design, and visual communication solutions",
    features: ["✔ Logo & Brand Identity", "✔ Marketing Materials", "✔ Social Media Graphics", "✔ Print Design"],
    startingPrice: "$500",
    duration: "1-2 weeks",
    icon: "palette"
  },
  {
    id: 2,
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with latest technologies",
    features: ["✔ Custom Web Development", "✔ React Applications", "✔ E-commerce Sites", "✔ API Integration"],
    startingPrice: "$1,500",
    duration: "2-4 weeks",
    icon: "code"
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "User-centered design solutions that combine aesthetics with functionality",
    features: ["✔ User Research", "✔ Wireframing & Prototyping", "✔ Design Systems", "✔ Usability Testing"],
    startingPrice: "$800",
    duration: "1-3 weeks",
    icon: "smartphone"
  },
  {
    id: 4,
    title: "Security Consulting",
    description: "Basic cybersecurity setup and consultation for small businesses and startups",
    features: ["✔ Security Audits", "✔ Best Practices Setup", "✔ Consultation", "✔ Training"],
    startingPrice: "$300",
    duration: "1 week",
    icon: "shield"
  }
];

export const projects = [
  {
    id: 1,
    title: "TechFlow Brand Identity",
    description: "Complete brand identity design for a tech startup including logo, color palette, and brand guidelines.",
    category: "Design",
    tags: ["Branding", "Logo Design", "Identity"],
    image: "https://images.unsplash.com/photo-1558655146-364addc1ba37?w=800&h=600&fit=crop",
    liveUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 2,
    title: "CryptoTracker Dashboard",
    description: "Real-time cryptocurrency tracking dashboard built with React and integrated with multiple APIs.",
    category: "Dev",
    tags: ["React", "API Integration", "Crypto"],
    image: "https://images.unsplash.com/photo-1641580318250-70245254acb0?w=800&h=600&fit=crop",
    liveUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 3,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration and admin dashboard.",
    category: "Dev",
    tags: ["Full-Stack", "E-commerce", "Node.js"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    liveUrl: "#",
    githubUrl: "#",
    featured: false
  },
  {
    id: 4,
    title: "Security Audit Tool",
    description: "Automated security scanning tool for small businesses to identify common vulnerabilities.",
    category: "Security",
    tags: ["Cybersecurity", "Python", "Security"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    liveUrl: "#",
    githubUrl: "#",
    featured: false
  },
  {
    id: 5,
    title: "AI Content Generator",
    description: "Experimental AI-powered content generation tool with custom training models.",
    category: "Experimental",
    tags: ["AI", "Machine Learning", "Experimental"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    liveUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 6,
    title: "Restaurant Mobile App Design",
    description: "Complete UI/UX design for a restaurant mobile application with ordering system.",
    category: "Design",
    tags: ["Mobile Design", "UI/UX", "Prototyping"],
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=600&fit=crop",
    liveUrl: "#",
    githubUrl: "#",
    featured: false
  }
];

export const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Cybersecurity: A Developer's Journey",
    excerpt: "My experience diving into cybersecurity fundamentals and essential tools every developer should know.",
    category: "Security",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    slug: "getting-started-cybersecurity-developer"
  },
  {
    id: 2,
    title: "Building Secure Web Applications in 2024",
    excerpt: "Best practices and modern approaches to web application security, including OWASP guidelines.",
    category: "Development",
    readTime: "12 min read",
    publishDate: "2024-01-08",
    slug: "building-secure-web-applications-2024"
  },
  {
    id: 3,
    title: "The Future of Web3 and Decentralized Applications",
    excerpt: "Exploring the potential of Web3 technologies and their impact on future web development.",
    category: "Crypto",
    readTime: "10 min read",
    publishDate: "2024-01-02",
    slug: "future-web3-decentralized-applications"
  },
  {
    id: 4,
    title: "Design Systems for Modern Web Applications",
    excerpt: "How to build scalable design systems that work across teams and projects.",
    category: "Design",
    readTime: "15 min read",
    publishDate: "2023-12-28",
    slug: "design-systems-modern-web-applications"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Startup Founder",
    company: "TechFlow",
    content: "John delivered an exceptional brand identity that perfectly captured our startup's vision. His attention to detail and creative approach exceeded our expectations.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "InnovateLabs",
    content: "The web application John built for us is not only beautiful but also incredibly functional. His technical expertise and design skills make him a rare talent.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Johnson",
    role: "Marketing Director",
    company: "GrowthCo",
    content: "Working with John was a pleasure. He understood our needs perfectly and delivered a complete branding package that helped us stand out in our market.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5
  }
];

export const certifications = [
  {
    id: 1,
    name: "CompTIA Security+ (In Progress)",
    issuer: "CompTIA",
    year: "2025",
    credentialUrl: "#"
  },
  {
    id: 2,
    name: "Graphics Design Certificate",
    issuer: "Canva",
    year: "2023",
    credentialUrl: "#"
  },
  {
    id: 3,
    name: "Google UX Design Certificate",
    issuer: "Google",
    year: "2022",
    credentialUrl: "#"
  },
  {
    id: 4,
    name: "UI/UX Design Certificate",
    issuer: "Figma",
    year: "2021",
    credentialUrl: "#"
  },
  {
    id: 5,
    name: "React Developer Certification",
    issuer: "Meta",
    year: "2021",
    credentialUrl: "#"
  },
];