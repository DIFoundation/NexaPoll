"use client";

import { Shield, Target, Users } from 'lucide-react';

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 pt-20 pb-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            About NexaPoll
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-8 text-blue-100">
            Empowering communities to build transparent, democratic, and efficient 
            decentralized autonomous organizations through cutting-edge blockchain technology.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Security First</h3>
            <p className="text-blue-100">
              Built on battle-tested smart contracts with comprehensive security audits and best practices.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Community Driven</h3>
            <p className="text-blue-100">
              Designed by the community, for the community. Every feature is built based on real user needs.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Innovation Focus</h3>
            <p className="text-blue-100">
              Pushing the boundaries of what's possible in decentralized governance and DAO management.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}