import React from "react";

interface RotatingCarouselProps {
  onNavigate?: (page: "job_search") => void;
}

const RotatingCarousel: React.FC<RotatingCarouselProps> = ({ onNavigate }) => {
  // Carousel items grouped by ring
  const rings = [
    {
      radius: 150,
      speed: 20,
      direction: 1,
      items: [
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png" },
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png" },
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Apple-Logo.png" },
      ],
    },
    {
      radius: 230,
      speed: 30,
      direction: -1,
      items: [
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      ],
    },
    {
      radius: 320,
      speed: 40,
      direction: 1,
      items: [
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Spotify-Logo.png" },
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Netflix-Logo.png" },
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Uber-Logo.png" },
        { src: "https://logos-world.net/wp-content/uploads/2020/09/Airbnb-Logo.png" },
      ],
    },
  ];

  return (
    <section className="relative py-20 bg-black overflow-hidden">
      <div className="relative w-full max-w-5xl mx-auto">
        <svg width="100%" height="800" viewBox="0 0 800 800">
          {rings.map((ring, index) => {
            const angleStep = (2 * Math.PI) / ring.items.length;

            return (
              <g
                key={index}
                style={{
                  transformOrigin: "400px 400px",
                  animation: `spin${index} ${ring.speed}s linear infinite ${
                    ring.direction === -1 ? "reverse" : "normal"
                  }`,
                }}
              >
                {/* Dotted Ring Path */}
                <circle
                  cx="400"
                  cy="400"
                  r={ring.radius}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="3"
                  strokeDasharray="10 14"
                  fill="none"
                />

                {/* Ring Items */}
                {ring.items.map((item, itemIndex) => {
                  const angle = angleStep * itemIndex;
                  const x = 400 + ring.radius * Math.cos(angle) - 25;
                  const y = 400 + ring.radius * Math.sin(angle) - 25;

                  return (
                    <image
                      key={itemIndex}
                      href={item.src}
                      x={x}
                      y={y}
                      height="50"
                      width="50"
                      style={{
                        borderRadius: "50%",
                      }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Center bubble */}
          <circle
            cx="400"
            cy="400"
            r="90"
            fill="rgba(255,255,255,0.15)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />

          <text
            x="400"
            y="395"
            textAnchor="middle"
            className="text-white"
            style={{ fontSize: "28px", fill: "#fff", fontWeight: "bold" }}
          >
            JobHub
          </text>

          <text
            x="400"
            y="425"
            textAnchor="middle"
            className="text-blue-200"
            style={{ fontSize: "14px", fill: "#cce4ff" }}
          >
            Connecting Talent
          </text>
        </svg>

        <style>{`
          @keyframes spin0 { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
          @keyframes spin1 { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
          @keyframes spin2 { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
        `}</style>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => onNavigate?.("job_search")}
          className="px-8 py-4 bg-blue-500 text-white rounded-xl shadow-lg hover:scale-105 transition"
        >
          Start Your Journey
        </button>
      </div>
    </section>
  );
};

export default RotatingCarousel;
