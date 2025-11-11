import React from 'react';

interface RotatingCarouselProps {
  onNavigate?: (page: 'job_search') => void;
}

const RotatingCarousel: React.FC<RotatingCarouselProps> = ({ onNavigate }) => {
  // Company logos and tech stack items for the rotating rings
  const rotatingItems = [
    // Inner ring - Tech companies
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png', alt: 'Google', ring: 1 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo.png', alt: 'Microsoft', ring: 1 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Amazon-Logo.png', alt: 'Amazon', ring: 1 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Meta-Logo.png', alt: 'Meta', ring: 1 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Apple-Logo.png', alt: 'Apple', ring: 1 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Tesla-Logo.png', alt: 'Tesla', ring: 1 },

    // Middle ring - Tech stack
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', alt: 'React', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', alt: 'Node.js', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', alt: 'Python', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', alt: 'Java', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', alt: 'JavaScript', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', alt: 'TypeScript', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', alt: 'Docker', ring: 2 },
    { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', alt: 'Kubernetes', ring: 2 },

    // Outer ring - More companies
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Netflix-Logo.png', alt: 'Netflix', ring: 3 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Spotify-Logo.png', alt: 'Spotify', ring: 3 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Uber-Logo.png', alt: 'Uber', ring: 3 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Airbnb-Logo.png', alt: 'Airbnb', ring: 3 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/Twitter-Logo.png', alt: 'Twitter', ring: 3 },
    { src: 'https://logos-world.net/wp-content/uploads/2020/09/LinkedIn-Logo.png', alt: 'LinkedIn', ring: 3 },
  ];

  const ringConfigs = [
    { radius: 180, speed: 30, direction: 1, items: rotatingItems.filter(item => item.ring === 1) },
    { radius: 280, speed: 45, direction: -1, items: rotatingItems.filter(item => item.ring === 2) },
    { radius: 380, speed: 60, direction: 1, items: rotatingItems.filter(item => item.ring === 3) },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-neutral-dark via-neutral-dark to-primary">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-6 border border-white/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Trusted by Industry Leaders
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Powering Careers at
            <span className="block bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent drop-shadow-lg">
              Top Companies Worldwide
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Join millions of professionals who trust JobHub to connect them with the world's most innovative companies and cutting-edge technologies.
          </p>
        </div>

        {/* Rotating Carousel Container */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative aspect-square w-full flex items-center justify-center">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 800"
              className="w-full h-full"
            >
              {ringConfigs.map((ring, ringIndex) => (
                <g key={ringIndex} className={`ring-${ringIndex}`}>
                  {/* Dotted orbital path */}
                  <circle
                    cx="400"
                    cy="400"
                    r={ring.radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                    strokeDasharray="12 18"
                    opacity="0.8"
                  />

                  {/* Rotating items */}
                  {ring.items.map((item, itemIndex) => {
                    const angle = (360 / ring.items.length) * itemIndex;
                    const radian = (angle * Math.PI) / 180;
                    const x = 400 + ring.radius * Math.cos(radian);
                    const y = 400 + ring.radius * Math.sin(radian);

                    return (
                      <g
                        key={`${ringIndex}-${itemIndex}`}
                        className={`rotating-item-${ringIndex}-${itemIndex}`}
                        style={{
                          transformOrigin: `${x}px ${y}px`,
                          animation: `rotate-${ringIndex} ${ring.speed}s linear infinite ${ring.direction === -1 ? 'reverse' : 'normal'}`,
                        }}
                      >
                        <image
                          href={item.src}
                          x={x - 28}
                          y={y - 28}
                          width="56"
                          height="56"
                          className="drop-shadow-xl hover:scale-110 transition-transform duration-300 rounded-lg"
                          style={{
                            filter: 'brightness(0) invert(1)',
                            backdropFilter: 'blur(10px)'
                          }}
                          onError={(e) => {
                            const target = e.target as SVGImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        {/* Fallback circle */}
                        <circle
                          cx={x}
                          cy={y}
                          r="24"
                          fill="rgba(255,255,255,0.1)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                          className="opacity-0"
                        />
                      </g>
                    );
                  })}
                </g>
              ))}

              {/* Center content */}
              <g>
                <circle
                  cx="400"
                  cy="400"
                  r="80"
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <text
                  x="400"
                  y="395"
                  textAnchor="middle"
                  className="text-2xl font-bold fill-white"
                  style={{ fontSize: '24px' }}
                >
                  JobHub
                </text>
                <text
                  x="400"
                  y="415"
                  textAnchor="middle"
                  className="text-sm fill-blue-200"
                  style={{ fontSize: '12px' }}
                >
                  Connecting Talent
                </text>
              </g>
            </svg>
          </div>

          {/* Call to action below the carousel */}
          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate?.('job_search')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-accent hover:border-white"
            >
              <span>Start Your Journey</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="text-gray-200 text-sm mt-4 drop-shadow-md">Join 1M+ professionals already on JobHub</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rotate-0 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotate-1 {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes rotate-2 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Enhanced hover effects */
        .ring-0:hover .rotating-item-0-0,
        .ring-0:hover .rotating-item-0-1,
        .ring-0:hover .rotating-item-0-2,
        .ring-0:hover .rotating-item-0-3,
        .ring-0:hover .rotating-item-0-4,
        .ring-0:hover .rotating-item-0-5 {
          animation-play-state: paused;
        }

        .ring-1:hover .rotating-item-1-0,
        .ring-1:hover .rotating-item-1-1,
        .ring-1:hover .rotating-item-1-2,
        .ring-1:hover .rotating-item-1-3,
        .ring-1:hover .rotating-item-1-4,
        .ring-1:hover .rotating-item-1-5,
        .ring-1:hover .rotating-item-1-6,
        .ring-1:hover .rotating-item-1-7 {
          animation-play-state: paused;
        }

        .ring-2:hover .rotating-item-2-0,
        .ring-2:hover .rotating-item-2-1,
        .ring-2:hover .rotating-item-2-2,
        .ring-2:hover .rotating-item-2-3,
        .ring-2:hover .rotating-item-2-4,
        .ring-2:hover .rotating-item-2-5 {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default RotatingCarousel;