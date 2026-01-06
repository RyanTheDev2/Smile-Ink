import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function usePosts(type?: 'hiring' | 'for_hire') {
  return useQuery({
    queryKey: [api.posts.list.path, type],
    queryFn: async () => {
      const url = type 
        ? `${api.posts.list.path}?type=${type}`
        : api.posts.list.path;
        
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      
      const data = await res.json();
      return api.posts.list.responses[200].parse(data);
    },
    // Refresh every 30 seconds for marketplace updates
    refetchInterval: 30000, 
  });
}
