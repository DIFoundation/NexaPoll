"use client";

import { Plus, Zap, Users } from 'lucide-react';
import Link from 'next/link';

export default function CreateDAOCTA() {
  return (
    <div className="mb-12">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-white/5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="w-8 h-8 mr-3" />
                <h2 className="text-2xl font-bold">Create Your DAO</h2>
              </div>
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                Launch your decentralized autonomous organization in minutes. 
                Set up governance, manage treasury, and empower your community 
                to make collective decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/create-dao"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create DAO
                </Link>
                <Link 
                  href="/about"
                  className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <h3 className="font-semibold mb-4 text-white">Why Create a DAO?</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-blue-100">
                    <Users className="w-4 h-4 mr-3 text-blue-300" />
                    <span className="text-sm">Democratic governance</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <Users className="w-4 h-4 mr-3 text-blue-300" />
                    <span className="text-sm">Transparent treasury management</span>
                  </div>
                  <div className="flex items-center text-blue-100">
                    <Users className="w-4 h-4 mr-3 text-blue-300" />
                    <span className="text-sm">Community-driven decisions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}