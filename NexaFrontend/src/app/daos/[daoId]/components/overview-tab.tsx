'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Activity, DollarSign, FileText, UserPlus, Users, Vote, Wallet, Zap } from "lucide-react"

type Proposal = {
  id: string
  title: string
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'pending'
  type: 'funding' | 'governance' | 'parameter' | 'membership'
  votesFor: number
  votesAgainst: number
  endDate: string
  proposer: string
}

type Activity = {
  id: string
  type: 'proposal' | 'vote' | 'transfer' | 'member'
  title: string
  description: string
  timestamp: string
  user: {
    address: string
    ensName?: string
    avatar?: string
  }
}

type OverviewTabProps = {
  daoId: string
}

export function OverviewTab({ daoId }: OverviewTabProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  // TODO: Fetch DAO data from contract or API
  const daoData = {
    name: 'Nexa DAO',
    description: 'A decentralized autonomous organization focused on building the future of web3 governance.',
    members: 1245,
    totalProposals: 124,
    activeProposals: 5,
    treasuryBalance: 2456789.12,
    votingPower: 42.5, // percentage of total supply
    votingEndsIn: '2d 14h',
    topVoters: [
      { address: '0x742d35Ce1339C8B7D2e8aE9B4eD4d1b1D4A5F4798', votes: 42 },
      { address: '0x1234567890123456789012345678901234567890', votes: 38 },
      { address: '0x0987654321098765432109876543210987654321', votes: 35 },
    ]
  }

  const recentProposals: Proposal[] = [
    {
      id: '1',
      title: 'Proposal to increase grant funding for Q4',
      status: 'active',
      type: 'funding',
      votesFor: 1250000,
      votesAgainst: 450000,
      endDate: '2025-12-15T23:59:59Z',
      proposer: '0x742d35Ce1339C8B7D2e8aE9B4eD4d1b1D4A5F4798'
    },
    {
      id: '2',
      title: 'Update governance parameters',
      status: 'passed',
      type: 'governance',
      votesFor: 3200000,
      votesAgainst: 120000,
      endDate: '2025-12-10T23:59:59Z',
      proposer: '0x1234567890123456789012345678901234567890'
    },
    {
      id: '3',
      title: 'Add new core team member',
      status: 'executed',
      type: 'membership',
      votesFor: 2800000,
      votesAgainst: 150000,
      endDate: '2025-12-05T23:59:59Z',
      proposer: '0x0987654321098765432109876543210987654321'
    }
  ]

  const recentActivities: Activity[] = [
    {
      id: '1',
      type: 'proposal',
      title: 'New proposal created',
      description: 'Proposal #42: Increase grant funding for Q4',
      timestamp: '2025-12-01T14:30:00Z',
      user: {
        address: '0x742d35Ce1339C8B7D2e8aE9B4eD4d1b1D4A5F4798',
        ensName: 'alice.eth',
        avatar: '/avatars/alice.png'
      }
    },
    {
      id: '2',
      type: 'vote',
      title: 'Vote cast',
      description: 'Voted FOR Proposal #41',
      timestamp: '2025-11-30T10:15:00Z',
      user: {
        address: '0x1234567890123456789012345678901234567890',
        ensName: 'bob.eth',
        avatar: '/avatars/bob.png'
      }
    },
    {
      id: '3',
      type: 'transfer',
      title: 'Treasury transfer',
      description: 'Transferred 10,000 USDC to grant recipient',
      timestamp: '2025-11-29T16:45:00Z',
      user: {
        address: '0x0987654321098765432109876543210987654321',
        ensName: 'charlie.eth',
        avatar: '/avatars/charlie.png'
      }
    },
    {
      id: '4',
      type: 'member',
      title: 'New member',
      description: 'dave.eth joined the DAO',
      timestamp: '2025-11-28T09:20:00Z',
      user: {
        address: '0x13579bdf02468acf159d0987654bafe642b4df3e',
        ensName: 'dave.eth',
        avatar: '/avatars/dave.png'
      }
    }
  ]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Active</Badge>
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      case 'executed':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Executed</Badge>
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getProposalTypeBadge = (type: string) => {
    switch (type) {
      case 'funding':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Funding</Badge>
      case 'governance':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Governance</Badge>
      case 'parameter':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Parameter</Badge>
      case 'membership':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Membership</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'vote':
        return <Vote className="h-4 w-4 text-green-500" />
      case 'transfer':
        return <DollarSign className="h-4 w-4 text-yellow-500" />
      case 'member':
        return <UserPlus className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(daoData.members)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treasury Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(daoData.treasuryBalance)}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daoData.activeProposals}</div>
            <p className="text-xs text-muted-foreground">
              {daoData.totalProposals} total proposals
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Voting Power</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daoData.votingPower}%</div>
            <div className="mt-2">
              <Progress value={daoData.votingPower} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Proposals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Proposals</CardTitle>
                <CardDescription>
                  Latest proposals and their current status
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proposal</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProposals.map((proposal) => (
                  <TableRow key={proposal.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {proposal.title}
                    </TableCell>
                    <TableCell>
                      {getProposalTypeBadge(proposal.type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(proposal.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center">
                          <span className="text-green-600 font-medium">
                            {formatNumber(proposal.votesFor)}
                          </span>
                          <span className="mx-1">/</span>
                          <span className="text-red-600">
                            {formatNumber(proposal.votesAgainst)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Ends {proposal.status === 'active' ? `in ${daoData.votingEndsIn}` : formatDate(proposal.endDate).split('at')[0]}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions in your DAO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.ensName || activity.user.address} />
                      <AvatarFallback>
                        {(activity.user.ensName || activity.user.address).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">
                        {activity.user.ensName || formatAddress(activity.user.address)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(activity.timestamp).split(',')[0]}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getActivityIcon(activity.type)}
                      <p className="text-sm">
                        <span className="font-medium">{activity.title}</span>{' '}
                        <span className="text-muted-foreground">{activity.description}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Voters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Top Voters</CardTitle>
              <CardDescription>
                Most active voters in the last 30 days
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View Leaderboard
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {daoData.topVoters.map((voter, index) => (
              <div key={voter.address} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <span className="font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {formatAddress(voter.address)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {voter.votes} votes
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Delegate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
