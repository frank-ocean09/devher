import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function DigitalHubCTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-primary/10 relative">
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-bold">Learn Anywhere</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
          We aren't at your school yet?
        </h2>
        <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          No worries — you can still be part of DevHer! Explore our Digital Hub to start learning from anywhere.
        </p>
        <Link
          to="/digitalhub"
          className="inline-block px-8 py-4 rounded-2xl bg-primary text-black font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all"
        >
          Go to our Digital Hub
        </Link>
      </div>
    </section>
  );
}
