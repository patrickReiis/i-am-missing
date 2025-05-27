import { Header } from '@/components/Header';
import { CreateReportForm } from '@/components/CreateReportForm';

export default function CreateReportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Report a Missing Person or Animal</h1>
            <p className="text-muted-foreground">
              Fill out the form below with as much detail as possible to help others identify and find your missing loved one.
            </p>
          </div>
          
          <CreateReportForm />
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