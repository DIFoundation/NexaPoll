"use client";

import { 
  Wallet, 
  Settings, 
  Users, 
  Vote, 
  Coins, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

const steps = [
  {
    step: "01",
    icon: Wallet,
    title: "Connect Wallet",
    description: "Connect your Web3 wallet to get started. Support for MetaMask, WalletConnect, and other popular wallets.",
    details: ["MetaMask integration", "WalletConnect support", "Multi-chain compatibility"]
  },
  {
    step: "02", 
    icon: Settings,
    title: "Configure DAO",
    description: "Set up your DAO parameters including governance settings, token type, and treasury configuration.",
    details: ["Choose ERC20 or ERC721 tokens", "Set voting parameters", "Configure timelock delays"]
  },
  {
    step: "03",
    icon: Users,
    title: "Add Members",
    description: "Invite members to your DAO and distribute voting power through token allocation or NFT minting.",
    details: ["Batch member addition", "Flexible voting power", "Role-based permissions"]
  },
  {
    step: "04",
    icon: Vote,
    title: "Create Proposals",
    description: "Submit governance proposals with rich metadata including treasury withdrawals, member changes, and custom actions.",
    details: ["Rich proposal metadata", "Multi-action proposals", "Automated execution"]
  },
  {
    step: "05",
    icon: Coins,
    title: "Vote & Execute",
    description: "Members vote on proposals and successful ones are automatically queued and executed through the timelock.",
    details: ["Democratic voting", "Quorum requirements", "Transparent execution"]
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your DAO up and running in minutes with our intuitive step-by-step process. 
            No technical expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line for desktop */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gray-200"></div>
          
          <div className="grid gap-8 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step content */}
                  <div className="text-center">
                    {/* Step number and icon */}
                    <div className="relative inline-flex items-center justify-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 relative z-10">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 z-20">
                        {step.step}
                      </div>
                    </div>

                    {/* Title and description */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-6">
                      {step.description}
                    </p>

                    {/* Feature list */}
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center justify-center text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center mt-8 lg:hidden">
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to build your DAO?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join hundreds of communities already using our platform to govern their projects democratically and transparently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                Start Building
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
              <button className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}