"use client";

import { 
  Users, 
  Coins, 
  Settings, 
  FileText,
  Clock,
  CheckCircle,
  Shield,
  Zap,
  Vote,
  Wallet,
  Code,
  Globe
} from 'lucide-react';

const allFeatures = [
  {
    icon: Users,
    title: "Member Management",
    description: "Add and remove members, manage voting power, and track participation. Built-in role-based access control for administrators.",
    details: ["Batch member addition", "Flexible voting power distribution", "Role-based permissions", "Member activity tracking"]
  },
  {
    icon: Coins,
    title: "Token-Based Voting",
    description: "Support for both ERC20 and ERC721 voting tokens. Flexible token distribution and minting capabilities for governance participation.",
    details: ["ERC20 and ERC721 support", "Flexible minting", "Token distribution tools", "Voting power calculations"]
  },
  {
    icon: Code,
    title: "Smart Contract Integration",
    description: "Built on OpenZeppelin's battle-tested contracts with custom enhancements for DAO-specific functionality.",
    details: ["OpenZeppelin foundation", "Custom DAO enhancements", "Audited code", "Upgradeable contracts"]
  },
  {
    icon: Globe,
    title: "Multi-Chain Support",
    description: "Deploy your DAOs across multiple blockchain networks for maximum accessibility and reduced costs.",
    details: ["Ethereum mainnet", "Layer 2 solutions", "Cross-chain compatibility", "Gas optimization"]
  },
  {
    icon: FileText,
    title: "Rich Proposal System",
    description: "Create detailed proposals with metadata, multiple actions, and comprehensive documentation.",
    details: ["Rich metadata support", "Multi-action proposals", "Proposal templates", "Documentation tools"]
  },
  {
    icon: Clock,
    title: "Timelock Security",
    description: "Advanced timelock mechanisms ensure all governance decisions have appropriate delays for community review.",
    details: ["Configurable delays", "Emergency pause", "Review periods", "Execution windows"]
  }
];

const additionalFeatures = [
  "On-chain proposal metadata with detailed descriptions",
  "Automated proposal execution after timelock delays",
  "Multi-signature treasury operations", 
  "Real-time voting power calculations",
  "Event-driven notification system",
  "Cross-chain compatibility support",
  "Advanced analytics and reporting",
  "Custom governance parameters",
  "Integration with popular DeFi protocols",
  "Mobile-responsive interface",
  "Gas optimization features",
  "Comprehensive API access"
];

const stats = [
  { icon: FileText, value: "99.9%", label: "Uptime" },
  { icon: Clock, value: "<2s", label: "Response Time" },
  { icon: Settings, value: "100%", label: "Customizable" },
  { icon: Shield, value: "0", label: "Security Exploits" }
];

export default function DetailedFeatures() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Complete Feature Set
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, manage, and grow successful decentralized autonomous organizations.
          </p>
        </div>

        {/* Detailed Features Grid */}
        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 mb-20">
          {allFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-200">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-6">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-7 mb-6">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Features List */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Additional Capabilities
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {additionalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h4>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="bg-gray-900 rounded-2xl p-8 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Built with modern technologies and following industry best practices for security and scalability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-3">Smart Contracts</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• OpenZeppelin Governance</li>
                <li>• ERC20/ERC721 Voting</li>
                <li>• Timelock Controller</li>
                <li>• Access Control</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Frontend</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• React & Next.js</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Web3 Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Blockchain</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Ethereum Compatible</li>
                <li>• Layer 2 Support</li>
                <li>• IPFS Integration</li>
                <li>• Event Indexing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}