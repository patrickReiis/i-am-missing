import { useState } from 'react';
import { useMissingReports } from '@/hooks/useMissingReports';
import { ReportCard } from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'person' | 'animal'>('all');
  const { data: reports, isLoading, error } = useMissingReports(50);

  const filteredReports = reports?.filter(report => {
    if (activeTab === 'all') return true;
    return report.kind === activeTab;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Help Find Missing People & Animals</h1>
            <p className="text-muted-foreground">
              Browse through reports of missing individuals and pets. Your help could reunite them with their loved ones.
            </p>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Reports</TabsTrigger>
                <TabsTrigger value="person">Missing People</TabsTrigger>
                <TabsTrigger value="animal">Missing Animals</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {renderReportsList(filteredReports, isLoading, error)}
            </TabsContent>
            <TabsContent value="person" className="mt-0">
              {renderReportsList(filteredReports, isLoading, error)}
            </TabsContent>
            <TabsContent value="animal" className="mt-0">
              {renderReportsList(filteredReports, isLoading, error)}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>FindThem - A decentralized platform for finding missing people and animals.</p>
          <p className="mt-1">Built on Nostr protocol for privacy and censorship resistance.</p>
        </div>
      </footer>
    </div>
  );
}

function renderReportsList(reports: any[] | undefined, isLoading: boolean, error: unknown) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading reports</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No reports found</p>
        <Button asChild>
          <a href="/create">Create a Report</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}