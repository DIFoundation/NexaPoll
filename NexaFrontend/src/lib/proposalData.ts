import { Proposal } from './types/dao';

export const dummyProposals: Proposal[] = [
  {
    id: 'p1',
    daoId: '1',
    title: 'Increase DAI borrowing limit to 200M',
    description: 'This proposal aims to increase the DAI borrowing limit from 150M to 200M to meet growing demand in the protocol.',
    status: 'active',
    startBlock: 15678900,
    endBlock: 15700500,
    forVotes: 12500000,
    againstVotes: 2500000,
    abstainVotes: 500000,
    proposer: '0x742d35Ce663eC3060270B8aE0b43Fb3Fb3b3b3b3',
    createdAt: '2025-10-15T08:30:00Z',
    updatedAt: '2025-10-20T14:30:00Z',
  },
  {
    id: 'p2',
    daoId: '2',
    title: 'PixelPunks V2 Artwork Update',
    description: 'Proposal to update the PixelPunks artwork to V2 with enhanced resolution and new traits.',
    status: 'pending',
    startBlock: 15700000,
    endBlock: 15721600,
    forVotes: 0,
    againstVotes: 0,
    abstainVotes: 0,
    proposer: '0x1234567890abcdef1234567890abcdef12345678',
    createdAt: '2025-10-20T10:15:00Z',
    updatedAt: '2025-10-20T10:15:00Z',
  },
  {
    id: 'p3',
    daoId: '3',
    title: 'Land Sale Event: Metaverse Expansion',
    description: 'Proposal to conduct a land sale event for the upcoming Metaverse expansion pack.',
    status: 'succeeded',
    startBlock: 15500000,
    endBlock: 15521600,
    forVotes: 9800000,
    againstVotes: 200000,
    abstainVotes: 0,
    proposer: '0xabcdef1234567890abcdef1234567890abcdef12',
    createdAt: '2025-09-28T14:20:00Z',
    updatedAt: '2025-10-21T08:10:00Z',
  },
  {
    id: 'p4',
    daoId: '4',
    title: 'Content Monetization Update',
    description: 'Update the content monetization model to include tipping and subscription features.',
    status: 'active',
    startBlock: 15680000,
    endBlock: 15701600,
    forVotes: 3200000,
    againstVotes: 1500000,
    abstainVotes: 300000,
    proposer: '0x34567890abcdef1234567890abcdef1234567890',
    createdAt: '2025-10-10T16:45:00Z',
    updatedAt: '2025-10-20T18:20:00Z',
  },
  {
    id: 'p5',
    daoId: '5',
    title: 'Governance Module V2',
    description: 'Upgrade to Governance Module V2 with gas optimizations and new features.',
    status: 'executed',
    startBlock: 15550000,
    endBlock: 15571600,
    forVotes: 15000000,
    againstVotes: 500000,
    abstainVotes: 0,
    proposer: '0x567890abcdef1234567890abcdef1234567890ab',
    createdAt: '2025-09-15T11:20:00Z',
    updatedAt: '2025-10-19T10:15:00Z',
  },
  {
    id: 'p6',
    daoId: '6',
    title: 'Security Standardization Initiative',
    description: 'Proposal to establish security best practices across all alliance members.',
    status: 'defeated',
    startBlock: 15600000,
    endBlock: 15621600,
    forVotes: 4500000,
    againstVotes: 5000000,
    abstainVotes: 1000000,
    proposer: '0x7890abcdef1234567890abcdef1234567890abcd',
    createdAt: '2025-10-05T09:30:00Z',
    updatedAt: '2025-10-20T09:30:00Z',
  },
  {
    id: 'p7',
    daoId: '7',
    title: 'Security Standardization Initiative',
    description: 'Proposal to establish security best practices across all alliance members.',
    status: 'defeated',
    startBlock: 15600000,
    endBlock: 15621600,
    forVotes: 4500000,
    againstVotes: 5000000,
    abstainVotes: 1000000,
    proposer: '0x7890abcdef1234567890abcdef1234567890abcd',
    createdAt: '2025-10-05T09:30:00Z',
    updatedAt: '2025-10-20T09:30:00Z',
  },
];

export const getProposalsByDAO = (daoId: string): Proposal[] => {
  return dummyProposals.filter(proposal => proposal.daoId === daoId);
};

export const getActiveProposals = (daoId?: string): Proposal[] => {
  const proposals = daoId 
    ? dummyProposals.filter(p => p.daoId === daoId) 
    : [...dummyProposals];
  
  return proposals.filter(p => p.status === 'active' || p.status === 'pending');
};

export const getProposalById = (id: string): Proposal | undefined => {
  return dummyProposals.find(proposal => proposal.id === id);
};