import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./components/overview-tab"
import { ProposalsTab } from "./components/proposals-tab"
import { TreasuryTab } from "./components/treasury-tab"
import { MembersTab } from "./components/members-tab"
import { TokenTab } from "./components/token-tab"
import { SettingsTab } from "./components/settings-tab"
import { Header } from "./components/header"

interface PageProps {
  params: {
    daoId: string
  }
}

export default function DAODashboardPage({
  params,
}: PageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="proposals">Proposals</TabsTrigger>
              <TabsTrigger value="treasury">Treasury</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="token">Token</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab daoId={params.daoId} />
          </TabsContent>
          
          <TabsContent value="proposals" className="space-y-4">
            <ProposalsTab daoId={params.daoId} />
          </TabsContent>
          
          <TabsContent value="treasury" className="space-y-4">
            <TreasuryTab daoId={params.daoId} />
          </TabsContent>
          
          <TabsContent value="members" className="space-y-4">
            <MembersTab daoId={params.daoId} />
          </TabsContent>
          
          <TabsContent value="token" className="space-y-4">
            <TokenTab daoId={params.daoId} />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <SettingsTab daoId={params.daoId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
