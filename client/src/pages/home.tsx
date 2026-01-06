import { Trophy, Star, Video, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Home() {
  return (
    <div className="space-y-24 pb-12">
      {/* Welcome Section */}
      <section className="relative pt-12 text-center max-w-4xl mx-auto">
        <motion.div {...fadeIn}>
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
            Official Community for Animation World
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
            Welcome to <span className="text-gradient">Smile Ink</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            The first-ever 2D animation game on Roblox. Connect with creators, 
            share your art, and join our vibrant community of animators.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left">
            {[
              { title: "Community", desc: "Share suggestions & report bugs", icon: Users },
              { title: "Events", desc: "Frequent giveaways & contests", icon: Star },
              { title: "Showcase", desc: "Display your animation skills", icon: Video },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Animator of the Week */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-3xl -z-10" />
        <div className="grid md:grid-cols-2 gap-12 items-center p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary font-bold">
              <Trophy className="w-6 h-6" />
              <span>WEEKLY COMPETITION</span>
            </div>
            <h2 className="text-4xl font-display font-bold">Animator of the Week</h2>
            <p className="text-muted-foreground text-lg">
              Show off your skills and win prizes! Simply post your animation in the <span className="text-foreground font-semibold">#creations</span> channel to enter automatically.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 flex-shrink-0">
                  <span className="font-bold text-xl">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">200 Robux Reward</h4>
                  <p className="text-sm text-muted-foreground">Direct payout to the weekly winner</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="font-bold text-xl">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Exclusive Role</h4>
                  <p className="text-sm text-muted-foreground">Get the "Animator of the Week" role</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 bg-black/40 border border-border flex items-center justify-center group">
            {/* Using a placeholder graphic for animation concept */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 mix-blend-overlay" />
            <Video className="w-20 h-20 text-muted-foreground/30 group-hover:text-primary transition-colors duration-500" />
            <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md text-sm font-medium border border-white/10">
              Win 200 R$
            </div>
          </div>
        </div>
      </section>

      {/* Ranking System */}
      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-bold mb-12">Rank System</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            "Beginner", "Newbie", "Intermediate", "Animator", "Advanced", "Master"
          ].map((rank, i) => (
            <div key={rank} className="p-4 rounded-xl bg-card border border-border/50 flex flex-col items-center gap-3 hover:border-primary/50 transition-all hover-elevate">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-muted-foreground">
                {i + 1}
              </div>
              <span className="font-medium text-sm">{rank}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Content Creator Program */}
      <section className="rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 p-8 md:p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Content Creator Program</h2>
            <p className="text-muted-foreground mb-8">
              Are you a content creator? Join our exclusive program to get special perks, roles, and early access.
            </p>
            
            <div className="space-y-6 mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "YouTube", val: "1k+ Subs" },
                  { label: "TikTok", val: "1k+ Followers" },
                  { label: "Twitter/X", val: "500+ Followers" },
                  { label: "Twitch", val: "200+ Followers" },
                ].map(req => (
                  <div key={req.label} className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                    <span className="text-sm text-muted-foreground">{req.label}</span>
                    <span className="text-sm font-bold text-primary">{req.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <a 
              href="https://forms.gle/2ohGyaoe95Np1ZXh9" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="bg-card/50 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-6">Program Perks</h3>
            <ul className="space-y-4">
              {[
                "Content Creator Tag in-game & Discord",
                "Exclusive access to creator channels",
                "Early sneak peeks of upcoming updates",
                "+1 Extra entry in all giveaways",
                "Custom role in Discord & Roblox Group",
                "Admin commands access"
              ].map((perk, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
