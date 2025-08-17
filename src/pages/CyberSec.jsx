import MetaBalls from "../components/react-ui/MetaBalls";

const CyberSec = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* MetaBalls background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <MetaBalls
          color="#ffffff"
          cursorBallColor="#ffffff"
          cursorBallSize={2}
          ballCount={15}
          animationSize={30}
          enableMouseInteraction={true}
          enableTransparency={true}
          hoverSmoothness={0.05}
          clumpFactor={1}
          speed={0.3}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen h-full w-full bg-white rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100
">
        <h1 className=" text-4xl font-bold text-center">
          Cybersecurity Dashboard
        </h1>
      </div>
    </section>
  );
};

export default CyberSec;
