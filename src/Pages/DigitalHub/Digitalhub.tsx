import Footer from "@/components/Utils/Footer"
import Navbar from "@/components/Utils/Navbar"
import { Code, Cpu, Palette, Lightbulb, ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

const Digitalhub = () => {
  const categories = [
    {
      title: "Electronics & Hardware",
      description: "Experiment with simple circuits directly on your screen.",
      icon: Cpu,
      link: "digital-hub/electronics",
      buttonText: "Try Electronics",
    },
    {
      title: "Coding & Software",
      description: "Start coding with beginner-friendly exercises.",
      icon: Code,
      link: "/digital-hub/coding",
      buttonText: "Start Coding",
    },
    {
      title: "Design & 3D Printing",
      description: "Learn to design and model your ideas digitally.",
      icon: Palette,
      link: "/digital-hub/design",
      buttonText: "Explore Design",
    },
    {
      title: "Pitch & Project Development",
      description: "Turn your ideas into impactful real-world projects.",
      icon: Lightbulb,
      link: "/digital-hub/pitch",
      buttonText: "Start Building",
    },
  ]

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl text-center">

          {/* Back Button */}
          <div className="mb-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all text-sm sm:text-base"
            >
              Go Back
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/20 border border-primary/30 text-xs sm:text-sm">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            <span className="text-primary font-bold">Learn From Anywhere</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            Digital Hub — Learn, Build &{" "}
            <span className="text-primary">Explore</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 sm:mb-16 px-2">
            Free learning resources inspired by DevHer School Club programs.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.title}
                  to={category.link}
                  className="group p-6 sm:p-8 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 text-left flex flex-col h-full"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    {category.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 grow">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all text-sm sm:text-base">
                    {category.buttonText}
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default Digitalhub