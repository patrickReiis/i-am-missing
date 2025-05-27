import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
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
};

export default NotFound;