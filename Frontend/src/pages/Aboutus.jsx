import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import member1 from "../assets/Images/Mahema.jpg";
import member2 from "../assets/Images/Numuchha.jpg";
import member3 from "../assets/Images/Liju.jpg";
import member4 from "../assets/Images/Spandana.jpg";
import member5 from "../assets/Images/Prinsha.png";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function AboutUs() {
  const membersTop = [
    { img: member1, name: "Mahema Gurung" },
    { img: member2, name: "Numuchha Rai" },
    { img: member3, name: "Liju Limbu" },
  ];

  const membersBottom = [
    { img: member4, name: "Spandana Rai" },
    { img: member5, name: "Prinsha Shrestha" },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />

      <main className="flex-grow px-4 md:px-16 py-16 bg-gray-50">
        {/* Team Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-12"
          >
            <span className="text-green-800">O</span>ur Members
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-16 mb-16">
            {membersTop.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-green-500 transition duration-300 hover:rotate-1"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-24">
            <div className="hidden md:block w-40"></div>

            {membersBottom.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 -mt-12"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-40 h-40 object-cover rounded-full mb-4 border-4 border-green-500 transition duration-300 hover:rotate-1"
                />
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}

            <div className="hidden md:block w-40"></div>
          </div>
        </motion.section>

        {/* About Us Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="bg-white py-20 rounded-lg shadow-inner"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl font-bold text-center mb-10"
          >
            <span className="text-green-600">A</span>bout Us
          </motion.h2>

          <div className="max-w-5xl mx-auto px-6 text-gray-700 leading-relaxed space-y-8">
            <motion.p variants={fadeInUp} className="text-lg text-center">
              <strong>Foliana</strong> is a C#.NET-powered platform that evolves
              a private library into a modern online bookstore. Blending
              in-store pickup with digital browsing, it offers members the
              ability to explore, buy, and track books from anywhere.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-10">
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-2 text-green-600">
                  What We Offer
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Browse books by author, genre, format, or price</li>
                  <li>Search for signed or collector’s editions</li>
                  <li>
                    Wishlist, shopping cart, loyalty discounts & reward points
                  </li>
                  <li>In-store pickup & real-time order tracking</li>
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-2 text-green-600">
                  Admin Features
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Manage books, inventory, and orders efficiently</li>
                  <li>Create and manage promotions & announcements</li>
                  <li>Use claim codes for fast in-store order processing</li>
                  <li>Track sales and customer engagement from dashboard</li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="bg-gray-100 rounded-lg p-6 shadow-md mt-10"
            >
              <h3 className="text-xl font-semibold text-center mb-4 text-green-700">
                Our Mission & Vision
              </h3>
              <p>
                Our mission is to extend the charm of traditional bookstores
                into the digital era. While we embrace technology to reach more
                readers, we continue to value the personal connection fostered
                through in-store pickups. Foliana bridges this gap — allowing
                both online convenience and offline intimacy.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-semibold mb-2 text-green-600 text-center">
                Objectives
              </h3>
              <ul className="list-disc list-inside space-y-2 max-w-3xl mx-auto">
                <li>Enable users to search and buy books from anywhere</li>
                <li>
                  Maintain in-store pickup model to preserve personal touch
                </li>
                <li>
                  Support wishlist, cart, and order tracking functionality
                </li>
                <li>Allow reviews from verified purchasers</li>
                <li>Empower staff to process orders via claim codes</li>
                <li>Provide tools for managing discounts and promotions</li>
                <li>
                  Drive growth by blending digital and in-store experiences
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
