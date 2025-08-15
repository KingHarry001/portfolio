import { ChevronDown } from "lucide-react";
import Particles from "../components/react-ui/Particles";
import CardSwap, { Card } from "../components/react-ui/CardSwap";
import myIcon1 from "../assets/svg1.svg";
import myIcon2 from "../assets/svg2.svg";
import myIcon3 from "../assets/svg3.svg";
import myIcon4 from "../assets/svg4.svg";
import check from "../assets/check.svg";
import VerticalScroller from "../components/react-ui/HorizontalScroller";

const WebDev = () => {
  const scrollToNext = () => {
    const element = document.querySelector("#next");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative text-white min-h-screen flex flex-col justify-center items-center overflow-hidden p-2"
      aria-label="Hero Section"
    >
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #2b092b 100%)",
        }}
      />

      {/* Particles Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={800}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 w-full py-16">
        {/* Hero Content */}
        <div className="h-full py-16 flex flex-col items-center text-center border-chart-1 border-1 chart-1 min-h-screen pt-16">
          <div className="inline-flex items-center px-4 py-2 chart-1/10 mb-5">
            <div className="w-2 h-2 chart-1 rounded-full animate-pulse mr-3"></div>
            <span className="text-chart-1 text-sm font-medium">
              Available for new projects
            </span>
          </div>
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              We Deliver
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Standout Websites
              </span>
              <br />
              <span className="text-gray-300">
                with effortless collaboration
              </span>
            </h2>

            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-400">
              <span className="font-semibold text-white">70+</span> Amazing
              Websites created so far
            </p>

            <a
              href="#contact"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 px-8 py-4 rounded-full text-lg font-semibold transition-transform transform hover:scale-105 shadow-lg shadow-pink-500/30"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* CardSwap Section */}
        <div className="min-h-screen w-full relative">
          <div className="text-left">
            <h2 className="text-5xl lg:text-[20vh] font-bold max-[460px]:leading-[8vh]">
              <span className="block my-2">Our</span>
              <span className="block my-2">Winning</span>
              <span className="block my-2">Edge</span>
            </h2>
            <p>Discover our unique strength and distinctive value we offer</p>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "100px",
              right: "70px",
            }}
          >
            <CardSwap
              cardDistance={60}
              verticalDistance={70}
              delay={5000}
              pauseOnHover={true}
            >
              <Card
                style={{
                  background: `
                    radial-gradient(125% 125% at 50% 90%, 
                      #000000 25%, 
                      #051a2b 55%, 
                      #093e4a 75%, 
                      #0f6a7a 100%),
                    radial-gradient(80% 80% at 50% 40%, 
                      rgba(0, 255, 255, 0.15), 
                      transparent 70%)
                  `,
                }}
              >
                <div className="text-left p-4 border-solid border-stone-100">
                  <h3>Seo Optimized</h3>
                </div>
                <div className="w-full h-0.5 bg-white" />
                <div className="w-full h-full px-10 flex flex-col items-center justify-center">
                  <img src={myIcon1} alt="icon" />
                  <p>
                    Our SEO-centric design approach enhances your online
                    visibility, driving organic traffic by securing prime ranks
                    on Google search.
                  </p>
                </div>
              </Card>
              <Card
                style={{
                  background: `
                    radial-gradient(125% 125% at 50% 90%, 
                      #000000 25%, 
                      #2b260b 55%, 
                      #4a3e09 75%, 
                      #7a6a0f 100%),
                    radial-gradient(80% 80% at 50% 40%, 
                      rgba(255, 255, 0, 0.15), 
                      transparent 70%)
                  `,
                }}
              >
                <div className="text-left p-4 border-solid border-stone-100">
                  <h3>High-Converting Design</h3>
                </div>
                <div className="w-full h-0.5 bg-white" />
                <div className="w-full h-full px-10 flex flex-col items-center justify-center">
                  <img src={myIcon2} alt="icon" />
                  <p>
                    Our engaging design techniques drive remarkable increases in
                    conversion rates by compelling visitors to take decisive,
                    intentional action.
                  </p>
                </div>
              </Card>
              <Card
                style={{
                  background: `
                    radial-gradient(125% 125% at 50% 90%, 
                      #000000 25%, 
                      #0b2b1a 55%, 
                      #094a3a 75%, 
                      #0f7a6a 100%),
                    radial-gradient(80% 80% at 50% 40%, 
                      rgba(0, 255, 170, 0.15), 
                      transparent 70%)
                  `,
                }}
              >
                <div className="text-left p-4 border-solid border-stone-100">
                  <h3>Peak Performance on Any Screen</h3>
                </div>
                <div className="w-full h-0.5 bg-white" />
                <div className="w-full h-full px-10 flex flex-col items-center justify-center">
                  <img src={myIcon3} alt="icon" />
                  <p>
                    Our fluid website experience guarantees flawless performance
                    across all screens, from desktops and laptops to tablets and
                    mobile devices.
                  </p>
                </div>
              </Card>
              <Card
                style={{
                  background: `
                    radial-gradient(125% 125% at 50% 90%, 
                      #000000 25%, 
                      #1a061a 55%, 
                      #2b092b 75%, 
                      #4a0f4a 100%),
                    radial-gradient(80% 80% at 50% 40%, 
                      rgba(255, 0, 255, 0.15), 
                      transparent 70%)
                  `,
                }}
              >
                <div className="text-left p-4 border-solid border-stone-100">
                  <h3>Fast Turnaround Time</h3>
                </div>
                <div className="w-full h-0.5 bg-white" />
                <div className="w-full h-full px-10 flex flex-col items-center justify-center ">
                  <img src={myIcon4} alt="icon" />
                  <p>
                    Launch your landing pages swiftly within 7 to 14 days,
                    ensuring fast access to online opportunities without
                    sacrificing quality.
                  </p>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>

        {/* Scroller Section */}
        <div className="min-h-screen pt-[5rem]">
          <h2 className="text-3xl lg:text-6xl font-bold lg:leading-[15vh]">
            Specialized in Crafting Brand Defining Hero Sections
          </h2>
          {[
            "Positive Initial Impression",
            "Clear Brand Introduction Message",
            "Improved Conversion Rates",
          ].map((text, idx) => (
            <div
              key={idx}
              className="inline-flex items-center px-4 py-2 chart-1/10"
            >
              <div className="chart-1 rounded-full animate-pulse mr-3">
                <img src={check} alt="icon" className="w-[30px] h-[30px]" />
              </div>
              <span className="text-chart-1 text-sm font-medium">{text}</span>
            </div>
          ))}
          <VerticalScroller />
        </div>

        {/* Noise Layer */}
        <div
          className="absolute inset-0 bg-noise opacity-5 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </section>
  );
};

export default WebDev;
