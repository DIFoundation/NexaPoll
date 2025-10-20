"use client";

import { Users, Vote, Coins, Building, TrendingUp, Shield } from 'lucide-react';

const stats = [
  {
    icon: Building,
    value: "50+",
    label: "Active DAOs",
    description: "Organizations using our platform"
  },
  {
    icon: Users,
    value: "10K+",
    label: "Community Members",
    description: "Active participants across all DAOs"
  },
  {
    icon: Vote,
    value: "500+",
    label: "Proposals Voted",
    description: "Democratic decisions made"
  },
  {
    icon: Coins,
    value: "$5M+",
    label: "Assets Under Management",
    description: "Total value in DAO treasuries"
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    description: "Platform reliability"
  },
  {
    icon: Shield,
    value: "0",
    label: "Security Incidents",
    description: "Perfect security record"
  }
];

export default function Stats() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Platform Impact
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Real numbers from our growing community of decentralized organizations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            );
          })}
        </div>

        {/* Growth Metrics */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Growing Every Day</h3>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Our platform continues to expand as more communities discover the power of decentralized governance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">150%</div>
              <div className="text-blue-100">Monthly Growth</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Community Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50ms</div>
              <div className="text-blue-100">Average Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}