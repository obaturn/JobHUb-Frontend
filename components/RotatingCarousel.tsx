import React from "react";
import { motion } from "framer-motion";
import { SECTION_SPACING, CONTAINER_SPACING } from '../src/design-system/tokens/spacing';

interface RotatingCarouselProps {
  onNavigate?: (page: "job_search") => void;
}

const RotatingCarousel: React.FC<RotatingCarouselProps> = ({ onNavigate }) => {
  // Company data with placeholder logos (you can replace with actual logos later)
  const companies = {
    tier1: [
      { name: "Google", color: "#4285F4" },
      { name: "Microsoft", color: "#00A1F1" },
      { name: "Apple", color: "#007AFF" },
    ],
    tier2: [
      { name: "Meta", color: "#1877F2" },
      { name: "Netflix", color: "#E50914" },
      { name: "Spotify", color: "#1DB954" },
      { name: "Tesla", color: "#CC0000" },
    ],
    tier3: [
      { name: "Uber", color: "#000000" },
      { name: "Airbnb", color: "#FF5A5F" },
      { name: "Stripe", color: "#635BFF" },
      { name: "Slack", color: "#4A154B" },
      { name: "Zoom", color: "#2D8CFF" },
    ],
  };

  // Ring configurations
  const rings = [
    {
      radius: 120,
      speed: 25,
      direction: 1,
      companies: companies.tier1,
    },
    {
      radius: 180,
      speed: 35,
      direction: -1,
      companies: companies.tier2,
    },
    {
      radius: 240,
      speed: 45,
      direction: 1,
      companies: companies.tier3,
    },
  ];

  // Generate company logo component
  const CompanyLogo: React.FC<{ company: { name: string; color: string }; size?: number }> = ({ 
    company, 
    size = 40 
  }) => (
    <motion.div
      whileHover={{ scale: 1.2, zIndex: 10 }}
      className="relative"
    >
      <div
        className="rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white/20"
        style={{ 
          backgroundColor: company.color,
          width: size,
          height: size,
          fontSize: size * 0.25
        }}
      >
        {company.name.charAt(0)}
      </div>
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
        {company.name}
      </div>
    </motion.div>
  );

  return (
    <section className={`relative ${SECTION_SPACING.large} bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden`}>
      {/* Background effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full opacity-50"
        />
      </div>

      <div className={`${CONTAINER_SPACING.default} relative z-10`}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Join thousands of companies already posting jobs on our platform
          </p>
        </motion.div>

        {/* Responsive carousel container */}
        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative w-full h-96 md:h-[500px] flex items-center justify-center">
            {/* Desktop version */}
            <div className="hidden md:block w-full h-full">
              <svg width="100%" height="100%" viewBox="0 0 600 500" className="overflow-visible">
                {rings.map((ring, ringIndex) => {
                  const angleStep = (2 * Math.PI) / ring.companies.length;
                  const centerX = 300;
                  const centerY = 250;

                  return (
                    <g key={ringIndex}>
                      {/* Dotted ring path */}
                      <motion.circle
                        cx={centerX}
                        cy={centerY}
                        r={ring.radius}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="8 12"
                        fill="none"
                        animate={{ rotate: ring.direction === 1 ? 360 : -360 }}
                        transition={{ 
                          duration: ring.speed, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                      />

                      {/* Company logos */}
                      <motion.g
                        animate={{ rotate: ring.direction === 1 ? 360 : -360 }}
                        transition={{ 
                          duration: ring.speed, 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
                      >
                        {ring.companies.map((company, companyIndex) => {
                          const angle = angleStep * companyIndex;
                          const x = centerX + ring.radius * Math.cos(angle) - 20;
                          const y = centerY + ring.radius * Math.sin(angle) - 20;

                          return (
                            <foreignObject
                              key={companyIndex}
                              x={x}
                              y={y}
                              width="40"
                              height="40"
                            >
                              <CompanyLogo company={company} />
                            </foreignObject>
                          );
                        })}
                      </motion.g>
                    </g>
                  );
                })}

                {/* Center hub */}
                <motion.circle
                  cx="300"
                  cy="250"
                  r="60"
                  fill="rgba(255,255,255,0.1)"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  whileHover={{ scale: 1.1 }}
                />
                <text
                  x="300"
                  y="245"
                  textAnchor="middle"
                  className="text-white font-bold"
                  style={{ fontSize: "20px", fill: "#fff" }}
                >
                  JobHub
                </text>
                <text
                  x="300"
                  y="265"
                  textAnchor="middle"
                  className="text-blue-200"
                  style={{ fontSize: "12px", fill: "#bfdbfe" }}
                >
                  Connecting Talent
                </text>
              </svg>
            </div>

            {/* Mobile version - simplified grid */}
            <div className="md:hidden w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-3 gap-4 max-w-xs mx-auto"
              >
                {[...companies.tier1, ...companies.tier2.slice(0, 3), ...companies.tier3.slice(0, 3)].map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-center"
                  >
                    <CompanyLogo company={company} size={50} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            onClick={() => onNavigate?.("job_search")}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Journey
          </motion.button>
          <p className="text-blue-200 text-sm mt-4">
            Join 50,000+ companies already hiring on JobHub
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RotatingCarousel;
