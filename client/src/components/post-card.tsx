import { type PostResponse, type Review, api, buildUrl } from "@shared/routes";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, User, MessageCircle, Star, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReviewSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PostCardProps {
  post: PostResponse;
}

export function PostCard({ post }: PostCardProps) {
  const { toast } = useToast();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const { data: reviews } = useQuery<Review[]>({
    queryKey: [buildUrl(api.reviews.list.path, { postId: post.id })],
  });

  const averageRating = reviews?.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const form = useForm({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      rating: 5,
      content: "",
      authorName: "",
      authorAvatar: "",
      postId: post.id,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: any) => {
      await apiRequest("POST", buildUrl(api.reviews.create.path, { postId: post.id }), values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.reviews.list.path, { postId: post.id })] });
      toast({ title: "Review submitted", description: "Your review has been added successfully." });
      setIsReviewOpen(false);
      form.reset();
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 border border-border/50 card-hover group relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-border group-hover:border-primary transition-colors">
            <AvatarImage src={`https://cdn.discordapp.com/avatars/${post.creatorId}/${post.creatorAvatar}.png`} alt={post.creatorUsername} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-foreground">@{post.creatorUsername}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-semibold">
                <Clock className="w-2.5 h-2.5" />
                {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}
              </span>
              {averageRating && (
                <span className="text-[10px] text-yellow-500 flex items-center gap-0.5 font-bold">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {averageRating}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
          post.type === 'hiring' 
            ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
            : 'bg-primary/10 text-primary border border-primary/20'
        }`}>
          {post.type === 'hiring' ? 'Hiring' : 'For Hire'}
        </span>
      </div>

      <h3 className="text-lg font-display font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">
        {post.title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
        {post.description}
      </p>

      {reviews && reviews.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Recent Review</span>
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] uppercase font-bold text-primary hover:text-primary/80">
                  <Plus className="w-3 h-3 mr-1" /> Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add a Review for @{post.creatorUsername}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="authorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl><Input placeholder="RobloxFan123" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (1-5)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="5" 
                              {...field} 
                              onChange={e => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Content</FormLabel>
                          <FormControl><Textarea placeholder="Great animator!" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                      Submit Review
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-xs italic text-muted-foreground line-clamp-1">"{reviews[0].content}"</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Payment</span>
          <span className="font-bold text-base flex items-center gap-1 text-foreground">
            <span className="text-primary text-sm">{post.paymentType === 'Robux' ? 'R$' : '$'}</span>
            {post.payment}
          </span>
        </div>
        
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Category</span>
          <span className="font-medium text-sm text-foreground capitalize">{post.type.replace('_', ' ')}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        {post.type === 'for_hire' && post.pastWork && (
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <a href={post.pastWork} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-2" />
              Portfolio
            </a>
          </Button>
        )}
        <Button size="sm" asChild className="flex-1">
          <a href={`https://discord.com/users/${post.creatorId}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-3.5 h-3.5 mr-2" />
            Contact
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
