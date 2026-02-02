import React from 'react';
import { motion } from 'framer-motion';

const Roadmap: React.FC = () => {
  const roadmapItems = [
    {
      phase: "Phase 1",
      title: "Foundation & Core Features",
      status: "completed",
      date: "Q1 2024",
      items: [
        "User authentication & profiles",
        "Job posting & search functionality",
        "Basic messaging system",
        "Company profiles"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Enhanced User Experience",
      status: "completed",
      date: "Q2 2024",
      items: [
        "Advanced search filters",
        "Resume builder & management",
        "Application tracking",
        "Mobile optimization"
      ]
    },
    {
      phase: "Phase 3",
      title: "AI & Smart Features",
      status: "current",
      date: "Q3 2024",
      items: [
        "AI-powered job recommendations",
        "Smart matching algorithms",
        "Automated screening tools",
        "Skill assessments"
      ]
    },
    {
      phase: "Phase 4",
      title: "Advanced Analytics",
      status: "upcoming",
      date: "Q4 2024",
      items: [
        "Market insights dashboard",
        "Salary benchmarking",
        "Career path recommendations",
        "Performance analytics"
      ]
    },
    {
      phase: "Phase 5",
      title: "Global Expansion",
      status: "upcoming", 
      date: "Q1 2025",
      items: [
        "Multi-language support",
        "Regional job markets",
        "International compliance",
        "Global talent network"
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'current':
        return '🚀';
      case 'upcoming':
        return '⏳';
      default:
        return '⏳';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <span>🗺️</span>
            Product Roadmap
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Journey Forward
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what we've accomplished and what's coming next as we continue to revolutionize the job market.
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 hidden md:block"></div>

          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 hidden md:block">
                  <div className={`w-full h-full rounded-full ${getStatusColor(item.status)}`}></div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    {/* Phase Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getStatusIcon(item.status)}</span>
                        <div>
                          <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                            {item.phase}
                          </h3>
                          <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">{item.date}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'current'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status === 'completed' ? 'Completed' : 
                         item.status === 'current' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Feature List */}
                    <ul className="space-y-3">
                      {item.items.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mobile Timeline Dot */}
                <div className="md:hidden w-6 h-6 rounded-full border-4 border-white shadow-lg my-4">
                  <div className={`w-full h-full rounded-full ${getStatusColor(item.status)}`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Want to Shape Our Future?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join our community and help us build the features that matter most to you. 
              Your feedback drives our roadmap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Share Feedback
              </button>
              <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Join Beta Program
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;