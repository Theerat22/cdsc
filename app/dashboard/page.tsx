"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";
import { BiSolidFileFind } from "react-icons/bi";
// import Navbar from '../components/NavBar';
import { FaMusic } from "react-icons/fa6";
import { MdSportsBasketball, MdMeetingRoom } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";

export default function StudentServicesDashboard() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Service colors data
  const teamColors = [
    {
      primary: "from-blue-500 to-indigo-600",
      secondary: "bg-blue-500",
      light: "bg-blue-100",
      text: "text-blue-600",
      hover: "group-hover:from-blue-600 group-hover:to-indigo-700",
      shadow: "shadow-blue-500/20 hover:shadow-blue-500/40",
    },
    {
      primary: "from-pink-500 to-purple-600",
      secondary: "bg-pink-500",
      light: "bg-pink-100",
      text: "text-pink-600",
      hover: "group-hover:from-pink-600 group-hover:to-purple-700",
      shadow: "shadow-pink-500/20 hover:shadow-pink-500/40",
    },
    {
      primary: "from-amber-400 to-orange-500",
      secondary: "bg-amber-400",
      light: "bg-amber-100",
      text: "text-amber-600",
      hover: "group-hover:from-amber-500 group-hover:to-orange-600",
      shadow: "shadow-amber-400/20 hover:shadow-amber-400/40",
    },
    {
      primary: "from-emerald-500 to-teal-600",
      secondary: "bg-emerald-500",
      light: "bg-emerald-100",
      text: "text-emerald-600",
      hover: "group-hover:from-emerald-600 group-hover:to-teal-700",
      shadow: "shadow-emerald-500/20 hover:shadow-emerald-500/40",
    },
    {
      primary: "from-purple-500 to-purple-600",
      secondary: "bg-purple-500",
      light: "bg-purple-100",
      text: "text-purple-600",
      hover: "group-hover:from-purple-600 group-hover:to-purple-700",
      shadow: "shadow-purple-500/20 hover:shadow-purple-500/40",
    },
  ];

  // Service cards data
  const serviceCards = [
    {
      title: "จองห้องประชุม",
      description: "",
      icon: <MdMeetingRoom className="text-xl sm:text-3xl md:text-3xl" />,
      link: "https://calendar.app.google/WHXDg1d1RgnVoZcB6",
      ctaText: "จอง",
      isOpen: true,
    },
    {
      title: "จองห้องดนตรี",
      description: "",
      icon: <FaMusic className="text-xl sm:text-2xl md:text-3xl" />,
      link: "https://calendar.app.google/b5YhjcRXLr9C2qjYA",
      ctaText: "จอง",
      isOpen: true,
    },
    {
      title: "CD Sports",
      description: "",
      icon: <MdSportsBasketball className="text-xl sm:text-3xl md:text-3xl" />,
      link: "https://liff.line.me/2006915917-M3RoQ7Ve",
      ctaText: "ดู",
      isOpen: true,
    },
    {
      title: "Lost and Found",
      description: "",
      icon: <BiSolidFileFind className="text-xl sm:text-3xl md:text-3xl" />,
      link: "",
      ctaText: "ดู",
      isOpen: true,
    },
    {
      title: "พอร์ตพี่มีให้ดู",
      description: "",
      icon: <IoIosPeople className="text-xl sm:text-2xl md:text-3xl" />,
      link: "",
      ctaText: "ยังไม่เปิดให้ใข้งาน",
      isOpen: false,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, type: "spring", stiffness: 100 },
    },
  };

  // Function to handle touch for mobile devices
  const handleTouchStart = (index: number) => {
    setHoveredCard(index);
  };

  const handleTouchEnd = () => {
    setHoveredCard(null);
  };

  return (
    <>
      {/* <Navbar /> */}
      <section className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50 to-indigo-100">
        {/* Abstract background shapes - responsive adjustments */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-10 sm:top-20 -left-10 sm:-left-20 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 sm:top-40 -right-10 sm:-right-20 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-10 sm:bottom-20 left-1/2 transform -translate-x-1/2 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-4 px-2 relative z-10 w-full">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex mb-6 sm:mb-8 md:mb-10 lg:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-4 font-bold bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
                CD Smart Campus
              </h2>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {serviceCards.map((card, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link href={card.link}>
                  <div
                    className={`relative h-full overflow-hidden rounded-2xl transform transition-all duration-500 ${
                      hoveredCard === index ? "scale-105" : ""
                    } ${teamColors[index].shadow}`}
                  >
                    {/* Card glow effect */}
                    <motion.div
                      className="absolute inset-0 z-0 opacity-75"
                      animate={{
                        boxShadow:
                          hoveredCard === index
                            ? `0 0 40px 5px ${
                                index === 0
                                  ? "rgba(239, 68, 68, 0.5)"
                                  : index === 1
                                  ? "rgba(59, 130, 246, 0.5)"
                                  : "rgba(245, 158, 11, 0.5)"
                              }`
                            : "0 0 0px 0px rgba(0, 0, 0, 0)",
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Card background */}
                    <div
                      className={`bg-gradient-to-br ${teamColors[index].primary} ${teamColors[index].hover} transition-all duration-500 h-full`}
                    >
                      {/* Inner content with glassmorphism effect */}
                      <div className="relative backdrop-blur-sm backdrop-filter bg-white/30 p-5 sm:p-6 md:p-8 h-full flex flex-col items-center">
                        {/* Icon container with animated glow */}
                        <motion.div
                          className={`relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-4 sm:mb-6 z-10 ${teamColors[index].light} text-white transition-colors duration-500 group-hover:text-white`}
                          animate={{
                            boxShadow:
                              hoveredCard === index
                                ? [
                                    `0 0 0 0px ${
                                      index === 0
                                        ? "rgba(239, 68, 68, 0.4)"
                                        : index === 1
                                        ? "rgba(59, 130, 246, 0.4)"
                                        : "rgba(245, 158, 11, 0.4)"
                                    }`,
                                    `0 0 0 10px ${
                                      index === 0
                                        ? "rgba(239, 68, 68, 0.2)"
                                        : index === 1
                                        ? "rgba(59, 130, 246, 0.2)"
                                        : "rgba(245, 158, 11, 0.2)"
                                    }`,
                                    `0 0 0 0px ${
                                      index === 0
                                        ? "rgba(239, 68, 68, 0.4)"
                                        : index === 1
                                        ? "rgba(59, 130, 246, 0.4)"
                                        : "rgba(245, 158, 11, 0.4)"
                                    }`,
                                  ]
                                : "0 0 0 0px rgba(0, 0, 0, 0)",
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: hoveredCard === index ? Infinity : 0,
                          }}
                        >
                          <div
                            className={`absolute inset-0 rounded-full transform transition-all duration-500 ${
                              hoveredCard === index
                                ? teamColors[index].secondary
                                : "opacity-0"
                            }`}
                          />
                          <div
                            className={`relative z-10 transition-colors duration-500 ${
                              hoveredCard === index
                                ? "text-white"
                                : teamColors[index].text
                            }`}
                          >
                            {card.icon}
                          </div>
                        </motion.div>

                        {/* Card content */}
                        <h3 className="text-xl sm:text-2xl font-bold text-white  text-center text-shadow">
                          {card.title}
                        </h3>
                        <p className="text-sm sm:text-base text-white/90 text-center mb-2 text-shadow-sm">
                          {card.description}
                        </p>

                        {/* CTA button */}
                        {card.isOpen ? (
                          <motion.div
                            className="mt-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full flex items-center transition-all duration-300 border border-white/30 group text-sm sm:text-base">
                              {card.ctaText}
                              <motion.div
                                animate={{ x: hoveredCard === index ? 5 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform duration-300"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </motion.div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            className="mt-auto"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="bg-gray-400/30 backdrop-blur-sm hover:bg-gray-300/40 text-white font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-400/20 text-sm sm:text-base cursor-not-allowed">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              เร็วๆ นี้
                            </div>
                          </motion.div>
                        )}
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

          .animate-blob {
            animation: blob-bounce 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @keyframes blob-bounce {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .scale-102 {
            transform: scale(1.02);
          }

          /* Ensure proper touch handling */
          * {
            -webkit-tap-highlight-color: transparent;
          }

          /* Mobile-specific adjustments */
          @media (max-width: 640px) {
            .animate-blob {
              animation-duration: 8s;
            }
          }
        `}</style>
      </section>
    </>
  );
}
