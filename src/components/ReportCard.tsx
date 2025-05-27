import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MissingReport } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { AuthorLink } from '@/components/AuthorLink';

interface ReportCardProps {
  report: MissingReport;
}

export function ReportCard({ report }: ReportCardProps) {
  // Author data is handled by the AuthorLink component
  
  const formattedDate = formatDistanceToNow(report.createdAt * 1000, { addSuffix: true });

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        {report.imageUrl ? (
          <img 
            src={report.imageUrl} 
            alt={report.name} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
        <Badge 
          className="absolute top-2 right-2" 
          variant={report.kind === 'person' ? 'destructive' : 'default'}
        >
          {report.kind === 'person' ? 'Missing Person' : 'Missing Animal'}
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{report.name}</CardTitle>
        <CardDescription>Last seen: {report.lastSeen}</CardDescription>
        <CardDescription>Location: {report.location}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {report.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-2 pt-0">
        <div className="flex items-center space-x-2 w-full">
          <div className="text-xs text-muted-foreground flex items-center">
            <span className="mr-1">Posted by</span> 
            <AuthorLink pubkey={report.pubkey} /> 
            <span className="ml-1">{formattedDate}</span>
          </div>
        </div>
        <Button asChild className="w-full">
          <Link to={`/report/${report.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}