import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMissingReports } from '@/hooks/useMissingReports';
import { ReportCard } from '@/components/ReportCard';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { MissingReport } from '@/lib/types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: reports, isLoading } = useMissingReports(100);
  const [filteredReports, setFilteredReports] = useState<MissingReport[]>([]);

  useEffect(() => {
    if (reports && query) {
      const lowerQuery = query.toLowerCase();
      const filtered = reports.filter(report => 
        report.name.toLowerCase().includes(lowerQuery) ||
        report.description.toLowerCase().includes(lowerQuery) ||
        report.location.toLowerCase().includes(lowerQuery)
      );
      setFilteredReports(filtered);
    }
  }, [reports, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
            <p className="text-muted-foreground">
              {filteredReports.length} {filteredReports.length === 1 ? 'result' : 'results'} found
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No reports found matching your search</p>
              <Button asChild>
                <a href="/">Back to Home</a>
              </Button>
            </div>
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