import Header from "../components/Header";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import Dock from "../components/react-ui/Dock";
import { VscAccount, VscHome, VscSend, VscSettingsGear } from "react-icons/vsc";
import { ChevronDown } from "lucide-react";
import TargetCursor from "../components/react-ui/TargetCursor";

const features = [
  {
    title: "Logo & Brand Identity",
    desc: "✔ Custom logos, ✔ color palette, ✔ typography, and brand guidelines.",
  },
  {
    title: "Marketing Materials",
    desc: ["✔ Flyers", "✔ brochures", "✔ presentations", "and more for your campaigns."],
  },
  {
    title: "Social Media Graphics",
    desc: ["✔ Branded post templates","✔ story covers", "and ad creatives."],
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
      <Header />
      <Dock items={items} magnification={50} className="border-chart-1" />
      <TargetCursor spinDuration={2} hideDefaultCursor={true} />

      {/* Hero Section */}
      <section
        className="text-white relative bg-gradient-to-br from-purple-700 via-indigo-900 to-gray-900 py-24 px-6 text-center overflow-hidden min-h-screen flex flex-col justify-center items-center"
        aria-label="Hero Section"
      >
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gray-900 rounded-xl p-6 shadow-lg hover:scale-105 transform transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
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

      <ContactSection />
      <Footer />
    </div>
  );
};

export default GraphicsPage;
