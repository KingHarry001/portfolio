import ChromaGrid from "./react-ui/ChromaGrid";

const items = [
  {
    image: "https://i.pravatar.cc/300?img=1",
    title: "Ava Martinez",
    subtitle:
      "Harrison took our brand from 'meh' to magnetic. The new website not only looks amazing — it converts better, loads faster, and actually reflects who we are. People keep asking who built it. Total game-changer.",
    handle: "@avamartinez",
    borderColor: "#3B82F6",
    gradient: "linear-gradient(145deg, #3B82F6, #000)",
    url: "https://github.com/avamartinez",
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Derek Lin",
    subtitle:
      "We hired Harrison to redesign our SaaS dashboard UI. Not only did he deliver pixel-perfect Figma files ahead of schedule, but he also helped us rethink flows and UX bottlenecks. Usage went up by 23% in the first month post-launch.",
    handle: "@derekux",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://linkedin.com/in/derekux",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Jasmine Patel",
    subtitle:
      "What I love about working with Harrison is that he listens. He didn’t just build a site — he built *our* site. The vibe, layout, messaging — all of it was tailored. It feels personal, polished, and pro.",
    handle: "@jasminemadeit",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(145deg, #8B5CF6, #000)",
    url: "https://github.com/jasminemadeit",
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Leo Turner",
    subtitle:
      "We’ve worked with agencies that overpromise and underdeliver. Harrison is the opposite. He’s fast, sharp, and totally dialed into the latest design and dev trends. Our landing page build was smooth and stress-free.",
    handle: "@leoturner",
    borderColor: "#EC4899",
    gradient: "linear-gradient(180deg, #EC4899, #000)",
    url: "https://linkedin.com/in/leoturner",
  },
  {
    image: "https://i.pravatar.cc/300?img=5",
    title: "Nina K.",
    subtitle:
      "Our Webflow site kept breaking. Harrison came in, cleaned up the mess, and gave us a scalable setup with clean CMS collections and zero jank. Wish we found him sooner.",
    handle: "@ninakdesign",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(145deg, #F59E0B, #000)",
    url: "https://github.com/ninakdesign",
  },
  {
    image: "https://i.pravatar.cc/300?img=6",
    title: "Samuel Osei",
    subtitle:
      "Harrison’s brand and logo design helped us finally look like the business we *actually* are. Everything just clicks now — social, web, pitch decks — it’s all cohesive. He’s got an eye, for real.",
    handle: "@samosei",
    borderColor: "#EF4444",
    gradient: "linear-gradient(180deg, #EF4444, #000)",
    url: "https://linkedin.com/in/samosei",
  },
  {
    image: "https://i.pravatar.cc/300?img=7",
    title: "Emily Zhao",
    subtitle:
      "I run a personal brand and needed a site that felt authentic — not corporate. Harrison nailed it. Mobile-first, super clean, and totally on-brand. The whole process was smooth from kickoff to launch.",
    handle: "@emzhao",
    borderColor: "#06B6D4",
    gradient: "linear-gradient(145deg, #06B6D4, #000)",
    url: "https://github.com/emzhao",
  },
  {
    image: "https://i.pravatar.cc/300?img=8",
    title: "Carlos Mendes",
    subtitle:
      "Working with Harrison was one of the best calls we made. Our product now looks as good as it works. He’s part dev, part designer, part creative strategist — all in one.",
    handle: "@carloshq",
    borderColor: "#A855F7",
    gradient: "linear-gradient(180deg, #A855F7, #000)",
    url: "https://linkedin.com/in/carloshq",
  },
];


const TestimonialsSection = () => {
  return (
    <section id="testimonial" className="py-10">
      <div className="max-w-7xl mx-auto px-6 pt-10 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Testi
            <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent inline-block">
              Monials
            </span>
          </h2>
        </div>
      </div>
      <div style={{ position: "relative" }}>
        <ChromaGrid
          items={items}
          radius={300}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
          className="py-[3rem]"
        />
      </div>
    </section>
  );
};

export default TestimonialsSection;
