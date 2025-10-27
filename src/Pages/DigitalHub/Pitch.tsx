import { Link } from "react-router-dom"
import Navbar from "@/components/Utils/Navbar"
import { ArrowLeft, FileText, Presentation, Lightbulb, Download, ExternalLink } from "lucide-react"
import Footer from "@/components/Utils/Footer"

export default function Pitch() {
  const resources = [
    {
      title: "Project Planning Template",
      description: "Organize your ideas and create a roadmap for your project.",
      icon: FileText,
      downloadUrl: "/templates/project-planning-template.pdf",
    },
    {
      title: "Pitch Deck Examples",
      description: "Learn from successful pitch presentations.",
      icon: Presentation,
      exampleUrl: "https://www.canva.com/templates/pitch-decks/",
    },
    {
      title: "Storytelling Guide",
      description: "Master the art of presenting your ideas compellingly.",
      icon: Lightbulb,
      downloadUrl: "/templates/storytelling-guide.pdf",
    },
  ]

  const tips = [
    {
      title: "Start with the Problem",
      description: "Clearly define the problem you're solving. Make it relatable and urgent.",
    },
    {
      title: "Show Your Solution",
      description: "Explain how your project solves the problem in a unique way.",
    },
    {
      title: "Know Your Audience",
      description: "Tailor your pitch to who you're presenting to - judges, investors, or community members.",
    },
    {
      title: "Practice, Practice, Practice",
      description: "Rehearse your pitch multiple times. Time yourself and get feedback.",
    },
    {
      title: "Tell a Story",
      description: "Use storytelling to make your pitch memorable and emotionally engaging.",
    },
    {
      title: "End with Impact",
      description: "Finish strong with a clear call-to-action and vision for the future.",
    },
  ]

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <Link
            to="/digitalhub"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Digital Hub
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Pitch & <span className="text-primary">Project Development</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12">Turn your ideas into real-world projects.</p>

          {/* Resources */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Resources & Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const Icon = resource.icon
                return (
                  <div
                    key={resource.title}
                    className="group p-6 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{resource.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{resource.description}</p>
                    {resource.downloadUrl && (
                      <a
                        href={resource.downloadUrl}
                        download
                        className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </a>
                    )}
                    {resource.exampleUrl && (
                      <a
                        href={resource.exampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Examples
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tips Section */}
          <div className="p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-2xl font-bold text-white mb-6">Step-by-Step Pitch Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="p-5 rounded-2xl bg-black/50 border border-primary/20 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 p-8 rounded-3xl bg-primary text-center">
            <h2 className="text-3xl font-bold text-black mb-4">Ready to Present Your Idea?</h2>
            <p className="text-black/80 mb-6 max-w-2xl mx-auto">
              Join our next DevHer pitch competition and showcase your project to judges, mentors, and potential
              partners.
            </p>
            <button className="px-8 py-4 rounded-2xl bg-black text-white font-bold hover:bg-black/90 hover:scale-105 transition-all">
              Register for Pitch Competition
            </button>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  )
}
