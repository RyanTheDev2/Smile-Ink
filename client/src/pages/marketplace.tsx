import { usePosts } from "@/hooks/use-posts";
import { PostCard } from "@/components/post-card";
import { useState } from "react";
import { Loader2, Briefcase, UserCheck, Search } from "lucide-react";

type FilterType = 'hiring' | 'for_hire' | 'all';

export default function Marketplace() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { data: posts, isLoading, isError } = usePosts(filter === 'all' ? undefined : filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-border/40">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Find talent or get hired for animation projects.</p>
        </div>
        
        <div className="flex p-1 bg-card border border-border rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter('hiring')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === 'hiring' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Hiring
          </button>
          <button
            onClick={() => setFilter('for_hire')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              filter === 'for_hire' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <UserCheck className="w-4 h-4" /> For Hire
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p>Loading marketplace posts...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 border border-destructive/20 rounded-xl bg-destructive/5 text-destructive">
          <p>Failed to load posts. Please try again later.</p>
        </div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-24 bg-card/50 rounded-2xl border border-dashed border-border">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No posts found</h3>
          <p className="text-muted-foreground">Check back later or join our Discord to post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
