import { Sparkles } from "lucide-react"
import AboutImage from "@/assets/About.jpg"
const About = () => {
  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/20 hover:border-primary/60 transition-all">
            <img
              src={AboutImage}
              alt="Girls learning technology"
              className="object-cover"
            />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-bold">About DevHer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">
              Building <span className="text-primary">Confidence</span>,{" "}
              <span className="text-primary">Creativity</span>, and <span className="text-primary">Code</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              DevHer School Club was created to bridge the technology gap for girls in schools by combining coding,
              electronics, and design into an inspiring, hands-on experience.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We believe every girl deserves the opportunity to explore technology, build innovative projects, and
              develop the confidence to become the next generation of tech leaders.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through mentorship, practical workshops, and a supportive community, we're transforming how girls engage
              with STEM education.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About