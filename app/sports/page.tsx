"use client";  
import { motion } from 'framer-motion';
import Link from 'next/link';
import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import { FaMedal } from "react-icons/fa6";
import { MdOutlineScoreboard } from "react-icons/md";
import BackButton from '../components/Back';
export default function SportsEventNav() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
  // Team colors data
  const teamColors = [
    { primary: 'from-red-500 to-pink-600', secondary: 'bg-red-500', light: 'bg-red-100', text: 'text-red-600', hover: 'group-hover:from-red-600 group-hover:to-pink-700', shadow: 'shadow-red-500/20 hover:shadow-red-500/40' },
    { primary: 'from-blue-500 to-indigo-600', secondary: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', hover: 'group-hover:from-blue-600 group-hover:to-indigo-700', shadow: 'shadow-blue-500/20 hover:shadow-blue-500/40' },
    { primary: 'from-yellow-400 to-orange-500', secondary: 'bg-yellow-400', light: 'bg-yellow-100', text: 'text-yellow-600', hover: 'group-hover:from-yellow-500 group-hover:to-orange-600', shadow: 'shadow-yellow-400/20 hover:shadow-yellow-400/40' }
  ];

  // Navigation cards data
  const navCards = [
    {
      title: "ตารางเหรียญ",
      description: "ดูอันดับและจำนวนเหรียญของแต่ละสี",
      icon: (<FaMedal className='text-2xl' />),
      link: "/sports/medals",
      ctaText: "ดูตารางเหรียญ"
    },
    {
      title: "สกอร์การแข่งขันล่าสุด",
      description: "ดูผลคะแนนการแข่งขันล่าสุด",
      icon: (<MdOutlineScoreboard className='text-2xl' />),
      link: "/sports/scores",
      ctaText: "ดูสกอร์ล่าสุด"
    },
    {
      title: "ปฏิทินการแข่งขัน",
      description: "ดูตารางเวลาและกำหนดการแข่งขันทั้งหมด",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="M8 14h.01"></path>
          <path d="M12 14h.01"></path>
          <path d="M16 14h.01"></path>
          <path d="M8 18h.01"></path>
          <path d="M12 18h.01"></path>
          <path d="M16 18h.01"></path>
        </svg>
      ),
      link: "/sports/calendar",
      ctaText: "ดูปฏิทิน"
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, type: "spring", stiffness: 100 } }
  };

  return (
    <>
    {/* <Navbar />
    <BackButton /> */}
    <section className="min-h-screen py-24 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navCards.map((card, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link href={card.link}>
                <div className={`relative h-full overflow-hidden rounded-2xl transform transition-all duration-500 ${hoveredCard === index ? 'scale-105' : ''} ${teamColors[index].shadow}`}>
                  {/* Card glow effect */}
                  <motion.div 
                    className="absolute inset-0 z-0 opacity-75" 
                    animate={{ 
                      boxShadow: hoveredCard === index 
                        ? `0 0 40px 5px ${index === 0 ? 'rgba(239, 68, 68, 0.5)' : index === 1 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`
                        : '0 0 0px 0px rgba(0, 0, 0, 0)'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Card background */}
                  <div className={`bg-gradient-to-br ${teamColors[index].primary} ${teamColors[index].hover} transition-all duration-500 h-full`}>
                    {/* Inner content with glassmorphism effect */}
                    <div className="relative backdrop-blur-sm backdrop-filter bg-white/30 p-5 sm:p-6 md:p-8 h-full flex flex-col items-center">
                      {/* Icon container with animated glow */}
                      <motion.div 
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-4 sm:mb-6 z-10 ${teamColors[index].light} text-white transition-colors duration-500 group-hover:text-white`}
                        animate={{ 
                          boxShadow: hoveredCard === index ? 
                            [
                              `0 0 0 0px ${index === 0 ? 'rgba(239, 68, 68, 0.4)' : index === 1 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
                              `0 0 0 10px ${index === 0 ? 'rgba(239, 68, 68, 0.2)' : index === 1 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                              `0 0 0 0px ${index === 0 ? 'rgba(239, 68, 68, 0.4)' : index === 1 ? 'rgba(59, 130, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                            ] : 
                            '0 0 0 0px rgba(0, 0, 0, 0)'
                        }}
                        transition={{ duration: 1.5, repeat: hoveredCard === index ? Infinity : 0 }}
                      >
                        <div className={`absolute inset-0 rounded-full transform transition-all duration-500 ${hoveredCard === index ? teamColors[index].secondary : 'opacity-0'}`} />
                        <div className={`relative z-10 transition-colors duration-500 ${hoveredCard === index ? 'text-white' : teamColors[index].text}`}>
                          {card.icon}
                        </div>
                      </motion.div>
                      
                      {/* Card content */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 text-center text-shadow">
                        {card.title}
                      </h3>
                      <p className="text-sm sm:text-base text-white/90 text-center mb-4 sm:mb-6 text-shadow-sm">
                        {card.description}
                      </p>
                      
                      {/* CTA button */}
                      <motion.div 
                        className="mt-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full flex items-center transition-all duration-300 border border-white/30 group text-sm sm:text-base">
                          {card.ctaText}
                          <motion.div
                            animate={{ x: hoveredCard === index ? 5 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Custom styles */}
      <style jsx global>{`
        .text-shadow {
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .text-shadow-sm {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
    </>
  );
};