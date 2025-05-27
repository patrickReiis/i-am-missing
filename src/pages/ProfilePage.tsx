import { useParams } from 'react-router-dom';
import { useMissingReportsByUser } from '@/hooks/useMissingReports';
import { useAuthor } from '@/hooks/useAuthor';
import { ReportCard } from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const { pubkey } = useParams<{ pubkey: string }>();
  const { data: reports, isLoading: reportsLoading } = useMissingReportsByUser(pubkey || '');
  const { data: authorData, isLoading: authorLoading } = useAuthor(pubkey || '');
  
  const metadata = authorData?.metadata;
  const displayName = metadata?.name || pubkey?.slice(0, 8) || '';
  const isLoading = reportsLoading || authorLoading;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <>
              <Card className="p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={metadata?.picture} />
                    <AvatarFallback className="text-2xl">{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold mb-2">{metadata?.display_name || displayName}</h1>
                    {metadata?.about && (
                      <p className="text-muted-foreground mb-4">{metadata.about}</p>
                    )}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {metadata?.nip05 && (
                        <div className="text-sm bg-secondary/50 px-3 py-1 rounded-full">
                          {metadata.nip05}
                        </div>
                      )}
                      {metadata?.website && (
                        <a 
                          href={metadata.website.startsWith('http') ? metadata.website : `https://${metadata.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-secondary/50 px-3 py-1 rounded-full hover:bg-secondary"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Reports by {metadata?.display_name || displayName}</h2>
                
                {reports && reports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No reports found from this user</p>
                    <Button asChild>
                      <a href="/">Back to Home</a>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
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