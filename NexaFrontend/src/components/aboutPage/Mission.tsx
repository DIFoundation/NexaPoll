"use client";

import { Globe, Lightbulb, Heart, Zap } from 'lucide-react';

export default function Mission() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Our Mission
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-8 mb-8">
              To democratize organizational governance and empower communities worldwide 
              to make collective decisions transparently, securely, and efficiently through 
              decentralized autonomous organizations.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-7">
                We believe that the future of organizations lies in decentralized governance, 
                where every stakeholder has a voice and decisions are made collectively through 
                transparent, immutable processes powered by blockchain technology.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Values */}
        <div className="grid gap-12 lg:grid-cols-2 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
            <p className="text-lg text-gray-600 leading-7 mb-6">
              We envision a world where organizations of all sizes - from small communities 
              to large enterprises - operate with complete transparency, where governance is 
              accessible to everyone, and where collective intelligence drives innovation.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Globe className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Global Accessibility</h4>
                  <p className="text-gray-600">Making DAO governance accessible to communities worldwide</p>
                </div>
              </div>
              <div className="flex items-start">
                <Lightbulb className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Innovation</h4>
                  <p className="text-gray-600">Continuously pushing the boundaries of decentralized governance</p>
                </div>
              </div>
              <div className="flex items-start">
                <Heart className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Community First</h4>
                  <p className="text-gray-600">Putting community needs at the center of everything we build</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why NexaPoll?</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Born from Experience</h4>
                <p className="text-gray-600">
                  Built by developers and community leaders who have experienced the challenges 
                  of traditional governance firsthand.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Excellence</h4>
                <p className="text-gray-600">
                  Leveraging the most advanced blockchain technologies and smart contract patterns 
                  for maximum security and efficiency.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">User-Centric Design</h4>
                <p className="text-gray-600">
                  Every feature is designed with the end user in mind, making complex blockchain 
                  interactions simple and intuitive.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Join the Revolution</h3>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Be part of the movement that&apos;s reshaping how organizations operate and make decisions.
          </p>
          <button className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-50 transition-colors">
            Start Your DAO Journey
          </button>
        </div>
      </div>
    </section>
  );
}