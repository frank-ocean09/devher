
const stories = [
    {
        name: "Bibbette Lucy Kanu",
        school: "Bilingual High School",
        quote: "DevHer showed me that I can build anything I imagine. Now I want to study computer science in college.",
        image: "/src/assets/Impact.jpg",
    },
    {
        name: "Sia M T Gborie",
        school: "Bilingual High School",
        quote: "I built my first circuit in DevHer Club. It was the coolest thing I've ever done!",
        image: "/src/assets/image.png",
    },
    {
        name: "Jarie F Jalloh",
        school: "Bilingual High School",
        quote: "The mentors at DevHer inspired me to start my own coding club one day.",
        image: "/src/assets/IMG_E1263.JPG",
    },
]
export function Impact() {
    return (
        <section id="impact" className="py-24 px-6 bg-linear-to-b from-transparent to-card/30">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Impact Stories</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Real stories from girls whose lives have been transformed by technology
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl bg-card border border-white/10 overflow-hidden hover:border-primary/50 transition-all"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={story.image || "/placeholder.svg"}
                                    alt={story.name}
                                    className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-full"
                                />
                            </div>
                            <div className="p-6">
                                <p className="text-white leading-relaxed mb-4 italic">"{story.quote}"</p>
                                <div>
                                    <div className="font-bold text-white">{story.name}</div>
                                    <div className="text-sm text-muted-foreground">{story.school}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    )
}
