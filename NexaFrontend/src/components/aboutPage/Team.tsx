"use client";

import { Github, Linkedin, Twitter } from 'lucide-react';

const team = [
  {
    name: "Alex Chen",
    role: "Co-Founder & CEO",
    image: "/api/placeholder/150/150",
    bio: "Former blockchain architect with 8+ years in decentralized systems. Led governance initiatives at major DeFi protocols.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#"
    }
  },
  {
    name: "Sarah Martinez",
    role: "Co-Founder & CTO",
    image: "/api/placeholder/150/150",
    bio: "Smart contract security expert and former lead developer at OpenZeppelin. Passionate about building secure DAO infrastructure.",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#"
    }
  },
  {
    name: "David Kim",
    role: "Head of Product",
    image: "/api/placeholder/150/150",
    bio: "Product strategist with deep experience in governance systems. Previously built tools for community management at scale.",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Maya Patel",
    role: "Lead Designer",
    image: "/api/placeholder/150/150",
    bio: "UX/UI specialist focused on making complex blockchain interactions intuitive. Champions user-centered design principles.",
    social: {
      twitter: "#",
      linkedin: "#"
    }
  }
];

const advisors = [
  {
    name: "Dr. Emily Thompson",
    role: "Governance Advisor",
    image: "/api/placeholder/150/150",
    bio: "Academic researcher in decentralized governance with 15+ published papers on DAO mechanisms."
  },
  {
    name: "Marcus Johnson",
    role: "Security Advisor",
    image: "/api/placeholder/150/150",
    bio: "Former security lead at top DeFi protocols. Expert in smart contract auditing and risk assessment."
  }
];

export default function Team() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate builders dedicated to democratizing organizational governance and 
            empowering communities worldwide.
          </p>
        </div>

        {/* Core Team */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Core Team</h3>
          <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-200 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-6 mb-6">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-500 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Advisory Board</h3>
          <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mr-6"></div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{advisor.name}</h4>
                    <p className="text-blue-600 font-medium">{advisor.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-6">{advisor.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals who share our passion for decentralized governance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-50 transition-colors">
              View Open Positions
            </button>
            <button className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}