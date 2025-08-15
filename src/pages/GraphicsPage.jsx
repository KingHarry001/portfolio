import { VscAccount, VscHome, VscSend, VscSettingsGear } from "react-icons/vsc";
import { ChevronDown } from "lucide-react";
import Beams from "../components/react-ui/Beams";
import FeaturesGrid from "../components/react-ui/SortableCard";

const features = [
  {
    title: "Logo & Brand Identity",
    desc: [
      "✔ Custom logos",
      "✔ Color palette",
      "✔ Typography",
      "and brand guidelines.",
    ],
  },
  {
    title: "Marketing Materials",
    desc: [
      "✔ Flyers",
      "✔ Brochures",
      "✔ Presentations",
      "and more for your campaigns.",
    ],
  },
  {
    title: "Social Media Graphics",
    desc: ["✔ Branded post templates", "✔ Story covers", "and ad creatives."],
  },
  {
    title: "Print Design",
    desc: ["✔ Packaging", "✔ posters", "✔ menus", "and business cards."],
  },
];

const portfolioImages = Array.from({ length: 9 }, (_, i) => ({
  src: `https://source.unsplash.com/600x400/?design,branding,creative&sig=${
    i + 1
  }`,
  alt: `Graphic Design Work ${i + 1}`,
}));

const GraphicsPage = () => {
  const items = [
    {
      icon: <VscHome size={23} />,
      label: "Home",
      onClick: () => scrollToSection("home"),
    },
    {
      icon: <VscAccount size={23} />,
      label: "About",
      onClick: () => scrollToSection("about"),
    },
    {
      icon: <VscSettingsGear size={23} />,
      label: "Services",
      onClick: () => scrollToSection("services"),
    },
    {
      icon: <span className="material-symbols-outlined">work_history</span>,
      label: "Gallery",
      onClick: () => scrollToSection("projects"),
    },
    {
      icon: <VscSend size={23} />,
      label: "Contact",
      onClick: () => scrollToSection("contact"),
    },
  ];

  const scrollToNext = () => {
    const element = document.querySelector("#next");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-background font-sans">
      {/* Hero Section */}
      <section
        className="text-white py-24 px-6 text-center overflow-hidden min-h-screen flex flex-col justify-center items-center"
        aria-label="Hero Section"
      >
        <div
          className="min-h-screen"
          style={{
            width: "100%",
            height: "600px",
            position: "absolute",
            zIndex: 0,
          }}
        >
          <Beams
            beamWidth={2}
            beamHeight={15}
            beamNumber={12}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={0}
          />
        </div>
        <div className="z-20">
          <div className="inline-flex items-center px-4 py-2 chart-1/10 border border-[#00FFD1]/20 rounded-full mb-5"> 
            <div className="w-2 h-2 chart-1 rounded-full animate-pulse mr-3"></div>
            <span className="text-chart-1 text-sm font-medium">
              Available for new projects
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold lg:leading-[15vh] mb-4">
            Graphic Design that <br /> Elevates Brands
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-gray-300 mb-8">
            Complete brand identity, logo design, and striking visual solutions
            tailored for your business.
          </p>
          <a
            href="#contact"
            className="btn-primary rounded-full text-lg font-semibold transition"
          >
            Get Started
          </a>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <button
              onClick={scrollToNext}
              className="text-foreground hover:text-foreground transition-colors duration-300"
            >
              <ChevronDown size={32} />
            </button>
          </div>

          <div
            className="absolute inset-0 bg-noise opacity-5 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* What's Included */}
      <section
        id="next"
        className="py-20 px-8 max-w-7xl mx-auto"
        aria-label="What's Included"
      >
        <h2 className="text-4xl font-bold mb-12 text-center">
          What’s Included
        </h2>
        <FeaturesGrid features={features} />
      </section>

      {/* Portfolio */}
      <section className="py-20 px-8 max-w-7xl mx-auto" aria-label="Portfolio">
        <h2 className="text-4xl font-bold text-center mb-12">Recent Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolioImages.map(({ src, alt }, idx) => (
            <div
              key={idx}
              className="bg-gray-800 aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform"
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className="bg-gradient-to-r from-indigo-900 via-gray-900 to-purple-900 py-20 px-6 text-center"
        aria-label="Pricing"
      >
        <h2 className="text-4xl font-bold mb-4">Design Package</h2>
        <p className="text-gray-300 mb-10">
          Premium quality design at a flat rate
        </p>
        <div className="inline-block bg-gray-800 border border-pink-600 rounded-xl p-10 shadow-2xl">
          <div className="text-5xl font-bold text-pink-500 mb-2">$500</div>
          <p className="text-lg text-gray-300 mb-6">Timeline: 1–2 weeks</p>
          <ul className="text-left text-gray-400 mb-6 space-y-2">
            <li>✔ Custom branding</li>
            <li>✔ 2 rounds of revisions</li>
            <li>✔ Delivery: AI, PSD, PNG, PDF</li>
          </ul>
          <a
            href="#contact"
            className="inline-block mt-4 px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-full font-medium"
          >
            Book Your Spot
          </a>
        </div>
      </section>
    </div>
  );
};

export default GraphicsPage;
