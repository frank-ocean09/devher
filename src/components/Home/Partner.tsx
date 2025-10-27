import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Laptop, Heart } from "lucide-react"

export function Partner() {
  return (
    <section id="partner" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Partner With Purpose</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in shaping the future of girls in tech. You can sponsor a school, donate tools, or fund a girl's
            tech journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-2xl bg-card border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sponsor a School</h3>
            <p className="text-muted-foreground leading-relaxed">
              Bring DevHer Club to an entire school and impact hundreds of girls.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Laptop className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Donate Equipment</h3>
            <p className="text-muted-foreground leading-relaxed">
              Provide laptops, Arduino kits, and Raspberry Pis to underserved communities.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Support a Girl</h3>
            <p className="text-muted-foreground leading-relaxed">
              Fund scholarships and mentorship programs for individual students.
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-card border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input id="name" placeholder="Your name" className="bg-background border-white/20 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-white">
                  Organization
                </Label>
                <Input
                  id="organization"
                  placeholder="Your organization"
                  className="bg-background border-white/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="bg-background border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your interest in partnering..."
                className="bg-background border-white/20 text-white min-h-32"
              />
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
