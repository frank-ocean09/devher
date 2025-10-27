import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 bg-linear-to-b from-transparent to-card/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Have questions? Want to start a club? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-primary font-semibold">
                  Name
                </Label>
                <Input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-card border-white/20 text-white placeholder:text-muted-foreground focus:border-primary rounded-3xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-primary font-semibold">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="bg-card border-white/20 text-white placeholder:text-muted-foreground focus:border-primary rounded-3xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-primary font-semibold">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  className="bg-card border-white/20 text-white placeholder:text-muted-foreground focus:border-primary min-h-40 rounded-3xl"
                  required
                />
              </div>

              {submitStatus === "success" && (
                <div className="p-4 bg-primary/20 border border-primary rounded-3xl text-white text-center">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-3xl text-white text-center">
                  Something went wrong. Please try again.
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-3xl h-12 transition-transform hover:scale-105"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4 p-4 rounded-3xl bg-card/50 border border-white/10 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                <a
                  href="mailto:hello@devher.org"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  devher.info@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl bg-card/50 border border-white/10 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
                <a href="tel:+15551234567" className="text-muted-foreground hover:text-primary transition-colors">
                  +232 72217607
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-3xl bg-card/50 border border-white/10 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                <p className="text-muted-foreground">27B Grassfield, Lumley </p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https:www.tiktok.com/@devh3r?_t=ZM-90mvQdp2TQC&_r=1"
                  className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https:www.tiktok.com/@devh3r?_t=ZM-90mvQdp2TQC&_r=1"
                  className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span className="sr-only">TikTok</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.04c5.52 0 10 4.48 10 10v.94h-2.5v-.94c0-4.14-3.36-7.5-7.5-7.5s-7.5 3.36-7.5 7.5c0 3.28 2.18 6.06 5.18 7.06v-2.11c-1.66-.62-2.68-2.24-2.68-4.02 0-2.42 1.98-4.4 4.4-4.4s4.4 1.98 4.4 4.4c0 .18-.02.36-.05.53h-1.85v5.6h-.9v-5.6H12c-.53 0-1-.43-1-1v-2.5h2.5V2.04z" />
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=615816138132447mibextid=wwXfr&mibextid=wwxIfr"
                  className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.23 0-1.61.77-1.61 1.56v1.87h2.74l-.44 2.89h-2.3v6.99C18.34 21.12 22 17 22 12z" />
                  </svg>
                </a>
                <a
                  href=""
                  className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span className="sr-only">WhatsApp</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.937 11.937 0 0012 0C5.373 0 0 5.373 0 12c0 2.116.553 4.09 1.516 5.836L0 24l6.378-1.516A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12 0-3.206-1.253-6.226-3.48-8.52zm-8.52 17.52c-1.995 0-3.96-.537-5.65-1.552l-.404-.243-3.78.9.902-3.69-.262-.416A9.935 9.935 0 012 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.437-7.77c-.076-.128-.276-.204-.578-.358-.3-.153-1.772-.876-2.048-.977-.276-.102-.477-.153-.678.153s-.777.977-.953 1.178c-.175.203-.35.229-.65.076-.3-.153-1.263-.465-2.404-1.486-.889-.794-1.486-1.774-1.661-2.073-.175-.3-.018-.462.135-.615.138-.137.3-.35.45-.525.152-.175.203-.3.304-.5.102-.2.051-.375-.026-.528-.076-.153-.678-1.63-.927-2.23-.244-.583-.492-.504-.678-.513-.175-.008-.375-.01-.575-.01s-.528.076-.805.375c-.276.3-1.05 1.025-1.05 2.5s1.077 2.898 1.225 3.096c.15.2 2.118 3.33 5.137 4.67 3.018 1.346 3.018.9 3.563.844.544-.053 1.772-.723 2.023-1.422.25-.698.25-1.296.175-1.422z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/devher.sl?igsh=MW01cGVseHIvNnBmbg%3D%3D7utm_source=qr"
                  className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.259.014-3.668.072-4.948.2-4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/devher-school-clubs-073b02388?utm_source=share&utm-cam-paign=share_via7utm_content=profile&utm_medium=ios_app"
                  className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
