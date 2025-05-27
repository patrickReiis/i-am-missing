import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { LoginArea } from '@/components/auth/LoginArea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="border-b sticky top-0 z-10 bg-background">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">FindThem</Link>
          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            Nostr
          </span>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search missing reports..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link to="/create" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Report Missing</span>
            </Link>
          </Button>
          <LoginArea />
        </div>
      </div>
    </header>
  );
}