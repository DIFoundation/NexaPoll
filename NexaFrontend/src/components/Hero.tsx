"use client";

import { ArrowRight, Vote, Users, Coins, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-100 opacity-50"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 mb-8">
            <Shield className="mr-2 h-4 w-4" />
            Decentralized. Secure. Transparent.
          </div>

          {/* Main headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Build and Govern
            <span className="text-blue-600"> DAOs</span> with Confidence
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 leading-8">
            Create decentralized autonomous organizations, manage treasuries, propose governance changes, 
            and vote on the future of your community. All powered by smart contracts and blockchain technology.
          </p>

          {/* Stats */}
          <div className="mt-12 flex justify-center space-x-12">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">1000+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Active Members</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Vote className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">500+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Proposals Voted</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <Coins className="h-8 w-8 text-yellow-600 mr-2" />
                <span className="text-3xl font-bold text-gray-900">$2M+</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Treasury Managed</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors duration-200">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="inline-flex items-center rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200">
              View Demo
            </button>
          </div>

          {/* Visual indicator */}
          <div className="mt-16">
            <p className="text-sm text-gray-500 mb-4">Trusted by leading blockchain projects</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}