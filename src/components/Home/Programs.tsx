import { Code, Cpu, Palette, Sparkles, Zap } from "lucide-react"

const Programs = () => {
  return (
     <section id="programs" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-bold">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="text-primary">Programs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hands-on experiences that combine technology, creativity, and innovation
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          <div className="p-8 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 group">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
              <Code className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Coding Workshops</h3>
            <p className="text-muted-foreground leading-relaxed">
              Learn programming fundamentals through interactive projects and real-world applications.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 group">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
              <Cpu className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Electronics & IoT</h3>
            <p className="text-muted-foreground leading-relaxed">
              Build circuits, program Arduino boards, and create smart devices from scratch.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 group">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
              <Palette className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Design Thinking</h3>
            <p className="text-muted-foreground leading-relaxed">
              Develop creative problem-solving skills and design user-centered solutions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 group">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Pitch & Project Development</h3>
            <p className="text-muted-foreground leading-relaxed">
              Develop the skills to craft, refine, and confidently present your ideas.
            </p>
          </div>
        </div>

        <div className="rounded-4xl bg-primary p-12 md:p-16 relative overflow-hidden shadow-2xl shadow-primary/40">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-black/20">
              <Sparkles className="h-4 w-4 text-black" />
              <span className="text-sm text-black font-bold">Special Campaign</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 text-balance">Leave No Girl Behind</h2>
            <p className="text-lg text-black/80 leading-relaxed mb-8">
              This campaign brings technology to underserved communities reaching girls who have never seen an Arduino
              board or coded before. It's about access, equity, and opportunity. We provide free equipment, mentorship,
              and resources to ensure every girl has the chance to explore her potential in tech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 rounded-2xl bg-black text-white font-bold hover:bg-black/90 hover:scale-105 transition-all shadow-lg">
                Support This Campaign
              </button>
              <button className="px-8 py-4 rounded-2xl border-2 border-black text-black font-bold hover:bg-black/10 hover:scale-105 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Programs