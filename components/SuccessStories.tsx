import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Story {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  story: string;
  beforeRole: string;
  afterRole: string;
  salaryIncrease: string;
  timeToHire: string;
  skills: string[];
}

const SuccessStories: React.FC = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const stories: Story[] = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      image: "👩‍💻",
      story: "JobHub helped me transition from a junior developer to a senior engineer at Google. The platform's AI matching connected me with opportunities I never would have found otherwise.",
      beforeRole: "Junior Developer",
      afterRole: "Senior Software Engineer",
      salaryIncrease: "+85%",
      timeToHire: "3 weeks",
      skills: ["React", "Node.js", "Python", "AWS"]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft",
      image: "👨‍💼",
      story: "After 5 years in marketing, I wanted to pivot to product management. JobHub's career resources and networking features made the transition seamless.",
      beforeRole: "Marketing Specialist",
      afterRole: "Product Manager",
      salaryIncrease: "+60%",
      timeToHire: "2 weeks",
      skills: ["Product Strategy", "Analytics", "Agile", "Leadership"]
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX Design Lead",
      company: "Meta",
      image: "👩‍🎨",
      story: "The design community on JobHub is incredible. I found mentors, collaborators, and ultimately my dream job at Meta through the platform's networking features.",
      beforeRole: "Freelance Designer",
      afterRole: "UX Design Lead",
      salaryIncrease: "+120%",
      timeToHire: "4 weeks",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"]
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, stories.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const storyVariants = {
    enter: { opacity: 0, x: 100, scale: 0.9 },
    center: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -100, scale: 0.9 }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 md:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" as const },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" as const }
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          rotate: -360,
          y: [0, -30, 0],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" as const },
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" as const }
        }}
        className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4"
          >
            Success Stories That Inspire
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Real professionals, real career transformations. See how JobHub has helped thousands advance their careers.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Main Story Display */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStory}
                variants={storyVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" as const }}
                className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {/* Gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                
                <div className="relative z-10">
                  {/* Profile Section */}
                  <div className="flex items-center mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-2xl mr-4"
                    >
                      {stories[currentStory].image}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-dark">{stories[currentStory].name}</h3>
                      <p className="text-primary font-semibold">{stories[currentStory].role}</p>
                      <p className="text-gray-500 text-sm">{stories[currentStory].company}</p>
                    </div>
                  </div>

                  {/* Story */}
                  <motion.blockquote 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-700 text-lg leading-relaxed mb-6 italic"
                  >
                    "{stories[currentStory].story}"
                  </motion.blockquote>

                  {/* Skills */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {stories[currentStory].skills.map((skill, index) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Quote decoration */}
                  <div className="absolute top-4 right-4 text-6xl text-primary/10 font-serif">"</div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className="flex justify-center mt-6 gap-2">
              {stories.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentStory(index);
                    setIsAutoPlaying(false);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStory 
                      ? 'bg-primary scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Career Progression Visualization */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Before/After Comparison */}
            <motion.div variants={cardVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h4 className="text-lg font-bold text-neutral-dark mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Career Transformation
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-2">
                    <p className="text-sm text-red-600 font-medium">Before</p>
                    <p className="text-red-800 font-bold">{stories[currentStory].beforeRole}</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-2">
                    <p className="text-sm text-green-600 font-medium">After</p>
                    <p className="text-green-800 font-bold">{stories[currentStory].afterRole}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div variants={cardVariants} className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-green-600 mb-2"
                >
                  {stories[currentStory].salaryIncrease}
                </motion.div>
                <p className="text-gray-600 text-sm">Salary Increase</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  className="text-3xl font-bold text-blue-600 mb-2"
                >
                  {stories[currentStory].timeToHire}
                </motion.div>
                <p className="text-gray-600 text-sm">Time to Hire</p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              variants={cardVariants}
              className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white text-center"
            >
              <h4 className="text-lg font-bold mb-2">Ready for Your Success Story?</h4>
              <p className="text-blue-100 text-sm mb-4">Join thousands of professionals who've transformed their careers</p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                Start Your Journey
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;