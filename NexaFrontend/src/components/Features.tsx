"use client";

import { 
  Zap, 
  Users, 
  Wallet, 
  Vote, 
  Settings, 
  Shield, 
  Coins, 
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: "Create DAOs Instantly",
    description: "Launch your decentralized autonomous organization with just a few clicks. Configure governance parameters, token settings, and treasury management.",
    color: "text-blue-600 bg-blue-100"
  },
  {
    icon: Vote,
    title: "Advanced Governance",
    description: "Create and vote on proposals with rich metadata. Support for timelock delays, quorum requirements, and democratic decision-making.",
    color: "text-green-600 bg-green-100"
  },
  {
    icon: Wallet,
    title: "Treasury Management", 
    description: "Secure multi-asset treasury with ETH and token support. Withdrawal proposals require community approval through governance votes.",
    color: "text-purple-600 bg-purple-100"
  },
  {
    icon: Users,
    title: "Member Management",
    description: "Add and remove members, manage voting power, and track participation. Built-in role-based access control for administrators.",
    color: "text-orange-600 bg-orange-100"
  },
  {
    icon: Coins,
    title: "Token-Based Voting",
    description: "Support for both ERC20 and ERC721 voting tokens. Flexible token distribution and minting capabilities for governance participation.",
    color: "text-yellow-600 bg-yellow-100"
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Built on battle-tested OpenZeppelin contracts with timelock protection, role-based permissions, and transparent execution.",
    color: "text-red-600 bg-red-100"
  }
];

const additionalFeatures = [
  "On-chain proposal metadata with detailed descriptions",
  "Automated proposal execution after timelock delays",
  "Multi-signature treasury operations", 
  "Real-time voting power calculations",
  "Event-driven notification system",
  "Cross-chain compatibility support"
];

export default function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to run a DAO
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            From creation to governance to treasury management, our platform provides all the tools 
            necessary for effective decentralized organization management.
          </p>
        </div>

        {/* Main features grid */}
        <div className="grid gap-12 lg:grid-cols-3 md:grid-cols-2 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-200 h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-6`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-7">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional features list */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Advanced Capabilities
              </h3>
              <div className="space-y-4">
                {additionalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">&lt;2s</div>
                  <div className="text-sm text-gray-600">Response</div>
                </div>
                <div className="text-center">
                  <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Customizable</div>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Exploits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}