import ImpactImage3 from "@/assets/impact3.jpg"
import gallery2 from "@/assets/gallery2.jpg"
import gallery3 from "@/assets/gallery3.jpg"
import gallery4 from "@/assets/gallery4.jpg"
import gallery5 from "@/assets/gallery5.jpg"
import gallery from "@/assets/gallery.jpg"


const images = [
  { src: ImpactImage3, alt: "Photo 1" },
  { src: gallery2, alt: "Photo 2" },
  { src: gallery3, alt: "Photo 3" },
  { src: gallery4, alt: "Photo 4" },
  { src: gallery5, alt: "Photo 5" },
  { src: gallery, alt: "Photo 6" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Gallery</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Moments from our workshops, clubs, and campaigns
          </p>
        </div>
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {images.map((image, index) => (
    <div
      key={index}
      className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all"
    >
      <img
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
      />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
