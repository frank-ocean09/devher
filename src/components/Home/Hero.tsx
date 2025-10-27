import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-primary/10" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-bounce-slow" />
      <div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-primary/25 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-bold">DevHer for Schools</span>
          <Heart className="h-4 w-4" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight text-balance">
          Empowering the Next Generation of{" "}
          <span className="text-primary inline-block animate-pulse">Female Innovators</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          DevHer School Club is transforming schools into spaces where girls learn, build, and create with technology.
          
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/contact">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all text-base px-8 shadow-lg shadow-primary/30"
          >
            Start a Club
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
         </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary/60 transition-all hover:scale-105 group">
            <div className="flex items-center justify-center mb-3">
              <Star className="h-8 w-8 text-primary group-hover:animate-spin" />
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">50+</div>
            <div className="text-white font-medium">Schools Reached</div>
          </div>
          <div className="p-8 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary/60 transition-all hover:scale-105 group">
            <div className="flex items-center justify-center mb-3">
              <Heart className="h-8 w-8 text-primary group-hover:animate-bounce" />
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">1,200+</div>
            <div className="text-white font-medium">Girls Trained</div>
          </div>
          <div className="p-8 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary/60 transition-all hover:scale-105 group">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="h-8 w-8 text-primary group-hover:animate-pulse" />
            </div>
            <div className="text-5xl md:text-6xl font-bold text-primary mb-2">25+</div>
            <div className="text-white font-medium">Programs Run</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero;