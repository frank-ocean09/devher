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
      link: "/digital-hub/electronics",
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
      <Navbar/>
      <section className="pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto text-center">

             <div className="mb-6">
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-colors"
      >
        Go Back
      </Link>
    </div>

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-bold">Learn From Anywhere</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Digital Hub — Learn, Build & <span className="text-primary">Explore</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
            Free learning resources inspired by DevHer School Club programs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.title}
                  to={category.link}
                  className="group p-8 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{category.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{category.description}</p>
                  <div className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                    {category.buttonText}
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  )
}

export default Digitalhub