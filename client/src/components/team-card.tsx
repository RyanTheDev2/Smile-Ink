import { type TeamMemberResponse } from "@shared/routes";
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";

interface TeamCardProps {
  member: TeamMemberResponse;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-xl p-6 border border-border/50 flex flex-col items-center text-center gap-4 hover:border-primary/50 transition-colors group"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-border group-hover:border-primary transition-colors relative">
        {member.avatarUrl ? (
          <img 
            src={member.avatarUrl} 
            alt={member.role}
            className="w-full h-full object-cover" 
            onError={(e) => {
              // Fallback to icon if image fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center text-muted-foreground ${member.avatarUrl ? 'hidden' : ''}`}>
          <UserCircle className="w-12 h-12" />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
          {member.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {member.role}
        </p>
        <div className="h-1 w-8 bg-primary/30 mx-auto mt-3 rounded-full" />
      </div>
    </motion.div>
  );
}
