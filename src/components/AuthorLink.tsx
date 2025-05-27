import { Link } from 'react-router-dom';
import { useAuthor } from '@/hooks/useAuthor';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AuthorLinkProps {
  pubkey: string;
  showAvatar?: boolean;
  className?: string;
}

export function AuthorLink({ pubkey, showAvatar = true, className = '' }: AuthorLinkProps) {
  const { data: authorData } = useAuthor(pubkey);
  const metadata = authorData?.metadata;
  const displayName = metadata?.name || pubkey.slice(0, 8);
  
  return (
    <Link 
      to={`/profile/${pubkey}`} 
      className={`flex items-center hover:underline ${className}`}
    >
      {showAvatar && (
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src={metadata?.picture} />
          <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <span>{metadata?.display_name || displayName}</span>
    </Link>
  );
}