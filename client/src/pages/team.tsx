import { useTeam } from "@/hooks/use-team";
import { TeamCard } from "@/components/team-card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Team() {
  const { data: teamMembers, isLoading, isError } = useTeam();

  // Create 8 empty slots if we don't have enough members to maintain the grid look
  // Or just map the data we have. The requirement says "Exactly 8 team slots".
  // Let's ensure we render 8 slots, filling with placeholders if needed.
  const slots = Array(8).fill(null).map((_, i) => teamMembers?.[i] || null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Meet the Team</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The dedicated individuals working behind the scenes to make Animation World possible.
        </p>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading team members...</p>
        </div>
      ) : isError ? (
        <div className="text-center p-12 border border-destructive/20 rounded-xl bg-destructive/5 text-destructive">
          <p>Failed to load team data. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {slots.map((member, i) => (
            member ? (
              <TeamCard key={member.id} member={member} index={i} />
            ) : (
              // Empty slot placeholder
              <motion.div 
                key={`empty-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card/30 rounded-xl p-6 border border-border/30 border-dashed flex flex-col items-center justify-center gap-4 aspect-[3/4]"
              >
                <div className="w-20 h-20 rounded-full bg-secondary/30" />
                <div className="h-4 w-24 bg-secondary/30 rounded" />
              </motion.div>
            )
          ))}
        </div>
      )}
    </div>
  );
}
