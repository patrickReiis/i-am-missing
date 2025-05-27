import { useNostr } from '@/hooks/useNostr';
import { useQuery } from '@tanstack/react-query';
import { MISSING_REPORT_KIND, MissingReport } from '@/lib/types';

export function useMissingReports(limit = 20) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['missing-reports', limit],
    queryFn: async (c) => {
      // Use a simple timeout for query
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const events = await nostr.query([{ kinds: [MISSING_REPORT_KIND], limit }], { 
          signal: controller.signal 
        });
        
        return events.map(event => {
          try {
            const content = JSON.parse(event.content);
            return {
              id: event.id,
              kind: content.kind,
              name: content.name,
              description: content.description,
              lastSeen: content.lastSeen,
              location: content.location,
              contactInfo: content.contactInfo,
              imageUrl: content.imageUrl,
              pubkey: event.pubkey,
              createdAt: event.created_at,
            } as MissingReport;
          } catch (e) {
            console.error('Failed to parse event content', e);
            return null;
          }
        }).filter(Boolean) as MissingReport[];
      } finally {
        clearTimeout(timeoutId);
      }
    },
  });
}

export function useMissingReportsByUser(pubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['missing-reports', 'user', pubkey],
    queryFn: async (c) => {
      // Use a simple timeout for query
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const events = await nostr.query([{ 
          kinds: [MISSING_REPORT_KIND], 
          authors: [pubkey],
        }], { 
          signal: controller.signal 
        });
        
        return events.map(event => {
          try {
            const content = JSON.parse(event.content);
            return {
              id: event.id,
              kind: content.kind,
              name: content.name,
              description: content.description,
              lastSeen: content.lastSeen,
              location: content.location,
              contactInfo: content.contactInfo,
              imageUrl: content.imageUrl,
              pubkey: event.pubkey,
              createdAt: event.created_at,
            } as MissingReport;
          } catch (e) {
            console.error('Failed to parse event content', e);
            return null;
          }
        }).filter(Boolean) as MissingReport[];
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!pubkey,
  });
}

export function useMissingReport(id: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['missing-report', id],
    queryFn: async (c) => {
      // Use a simple timeout for query
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const events = await nostr.query([{ kinds: [MISSING_REPORT_KIND], ids: [id] }], { 
          signal: controller.signal 
        });
        
        if (events.length === 0) {
          throw new Error('Report not found');
        }
        
        const event = events[0];
        try {
          const content = JSON.parse(event.content);
          return {
            id: event.id,
            kind: content.kind,
            name: content.name,
            description: content.description,
            lastSeen: content.lastSeen,
            location: content.location,
            contactInfo: content.contactInfo,
            imageUrl: content.imageUrl,
            pubkey: event.pubkey,
            createdAt: event.created_at,
          } as MissingReport;
        } catch (e) {
          console.error('Failed to parse event content', e);
          throw new Error('Invalid report format');
        }
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!id,
  });
}