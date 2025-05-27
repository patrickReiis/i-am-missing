import { useParams, Link } from 'react-router-dom';
import { useMissingReport } from '@/hooks/useMissingReports';
import { useAuthor } from '@/hooks/useAuthor';
import { format } from 'date-fns';
import { Share2, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';

export function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: report, isLoading, error } = useMissingReport(id || '');
  
  const author = report ? useAuthor(report.pubkey) : { data: null, isLoading: false };
  const metadata = author.data?.metadata;
  const displayName = metadata?.name || (report?.pubkey.slice(0, 8) || '');
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Missing ${report?.kind}: ${report?.name}`,
        text: `Please help find ${report?.name}. Last seen at ${report?.lastSeen} in ${report?.location}.`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'The link to this report has been copied to your clipboard.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 items-center justify-center min-h-[400px]">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p>Loading report...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4 items-center justify-center min-h-[400px]">
              <p className="text-destructive">Error loading report. It may not exist or has been removed.</p>
              <Button asChild>
                <Link to="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedDate = format(report.createdAt * 1000, 'PPP');

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-4">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all reports
          </Link>
        </Button>
      </div>
      
      <Card className="w-full overflow-hidden">
        <div className="relative">
          {report.imageUrl ? (
            <img 
              src={report.imageUrl} 
              alt={report.name} 
              className="w-full h-64 md:h-96 object-cover"
            />
          ) : (
            <div className="w-full h-64 md:h-96 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-lg">No image available</span>
            </div>
          )}
          <Badge 
            className="absolute top-4 right-4 text-sm px-3 py-1" 
            variant={report.kind === 'person' ? 'destructive' : 'default'}
          >
            {report.kind === 'person' ? 'Missing Person' : 'Missing Animal'}
          </Badge>
        </div>
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{report.name}</CardTitle>
              <CardDescription className="text-base mt-2">
                Last seen: {report.lastSeen}
              </CardDescription>
              <CardDescription className="text-base">
                Location: {report.location}
              </CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{report.description}</p>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
            <p>{report.contactInfo}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-start space-y-4 pt-2 pb-6">
          <Separator />
          <div className="flex items-center space-x-3 w-full">
            <Avatar>
              <AvatarImage src={metadata?.picture} />
              <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">Posted on {formattedDate}</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}