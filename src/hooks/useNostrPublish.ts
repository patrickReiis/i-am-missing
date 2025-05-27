import { useNostr } from "@nostrify/react";
import { useMutation } from "@tanstack/react-query";
import { NostrEvent } from "@nostrify/nostrify";

import { useCurrentUser } from "./useCurrentUser";

interface EventTemplate {
  kind: number;
  content?: string;
  tags?: string[][];
  created_at?: number;
}

export function useNostrPublish() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async (t: EventTemplate): Promise<NostrEvent> => {
      if (user) {
        const tags = t.tags ?? [];

        // Add the client tag if it doesn't exist
        if (!tags.some((tag) => tag[0] === "client")) {
          tags.push(["client", "FindThem"]);
        }

        const event = await user.signer.signEvent({
          kind: t.kind,
          content: t.content ?? "",
          tags,
          created_at: t.created_at ?? Math.floor(Date.now() / 1000),
        });

        // Use a simple timeout for publishing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          await nostr.event(event, { signal: controller.signal });
          return event;
        } finally {
          clearTimeout(timeoutId);
        }
      } else {
        throw new Error("User is not logged in");
      }
    },
    onError: (error) => {
      console.error("Failed to publish event:", error);
    },
  });
}