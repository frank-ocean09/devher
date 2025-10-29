import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Utils/Navbar"
import { ArrowLeft, Play, Code, Youtube, CheckCircle2, X } from "lucide-react"
import Footer from "@/components/Utils/Footer"

type Language = "javascript" | "html" | "css" | "python"

const lessons = [
  {
    id: 1,
    title: "Hello World - Your First Program",
    description: "Learn the basics of programming by writing your first 'Hello World' program in multiple languages.",
    youtubeUrl: "https://youtu.be/W6NZfCO5SIk?si=g0H15LsmCR_ok2Izl",
    languages: {
      javascript: {
        code: `// Welcome to DevHer Coding!
console.log("Hello, DevHer!");`,
        exercise: "Change the text to display your own name instead of 'DevHer'",
      },
      html: {
        code: `<!DOCTYPE html>
<html>
<head>
  <title>Hello DevHer</title>
</head>
<body>
  <h1>Hello, DevHer!</h1>
</body>
</html>`,
        exercise: "Add a paragraph below the heading with your favorite quote",
      },
      css: {
        code: `h1 {
  color: #FFC5D3;
  text-align: center;
  font-size: 48px;
}`,
        exercise: "Change the color to your favorite color",
      },
      python: {
        code: `# Welcome to Python!
print("Hello, DevHer!")`,
        exercise: "Print your name and age on separate lines",
      },
    },
  },
  {
    id: 2,
    title: "Variables & Data Types",
    description: "Understand how to store and use data in your programs with variables.",
    youtubeUrl: "https://youtube.com/watch?v=variables-tutorial",
    languages: {
      javascript: {
        code: `// Variables store information
let name = "Future Coder";
let age = 15;
let isStudent = true;

console.log("Name: " + name);
console.log("Age: " + age);
console.log("Is Student: " + isStudent);`,
        exercise: "Create variables for your favorite color, food, and hobby, then display them",
      },
      python: {
        code: `# Variables in Python
name = "Future Coder"
age = 15
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Is Student: {is_student}")`,
        exercise: "Create a variable for your school name and print it",
      },
    },
  },
  {
    id: 3,
    title: "Loops & Conditionals",
    description: "Learn how to repeat actions and make decisions in your code.",
    youtubeUrl: "https://youtube.com/watch?v=loops-tutorial",
    languages: {
      javascript: {
        code: `// For loop - repeat actions
for (let i = 1; i <= 10; i++) {
  console.log("Count: " + i);
}

// If statement - make decisions
let score = 85;
if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else {
  console.log("Grade: C");
}`,
        exercise: "Write a loop that prints only even numbers from 1 to 20",
      },
      python: {
        code: `# For loop in Python
for i in range(1, 11):
    print(f"Count: {i}")

# If statement
score = 85
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
else:
    print("Grade: C")`,
        exercise: "Create a program that checks if a number is positive, negative, or zero",
      },
    },
  },
  {
    id: 4,
    title: "Functions & Logic",
    description: "Organize your code into reusable functions and build complex logic.",
    youtubeUrl: "https://youtube.com/watch?v=functions-tutorial",
    languages: {
      javascript: {
        code: `// Functions - reusable code blocks
function greet(name) {
  return "Hello, " + name + "!";
}

function add(a, b) {
  return a + b;
}

console.log(greet("DevHer"));
console.log("Sum: " + add(5, 3));`,
        exercise: "Create a function that calculates the area of a rectangle",
      },
      python: {
        code: `# Functions in Python
def greet(name):
    return f"Hello, {name}!"

def add(a, b):
    return a + b

print(greet("DevHer"))
print(f"Sum: {add(5, 3)}")`,
        exercise: "Write a function that checks if a number is even or odd",
      },
    },
  },
  {
    id: 5,
    title: "Build a Simple Web Page",
    description: "Combine HTML, CSS, and JavaScript to create your first interactive webpage.",
    youtubeUrl: "https://youtube.com/watch?v=webpage-tutorial",
    languages: {
      html: {
        code: `<!DOCTYPE html>
<html>
<head>
  <title>My DevHer Page</title>
  <style>
    body {
      background-color: #FFC5D3;
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 50px;
    }
    button {
      background-color: #000;
      color: #FFC5D3;
      padding: 15px 30px;
      border: none;
      border-radius: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Welcome to My Page!</h1>
  <p>This is my first webpage created at DevHer.</p>
  <button onclick="alert('Hello from DevHer!')">Click Me!</button>
</body>
</html>`,
        exercise: "Add your name to the heading and change the button text to something creative",
      },
    },
  },
]

export default function Coding() {
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState(lessons[0].languages.javascript!.code)
  const [output, setOutput] = useState("")
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [showYoutubeModal, setShowYoutubeModal] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")

  // Pyodide loading (once)
  const pyodideReady = useRef<Promise<any> | null>(null)

  useEffect(() => {
    if (!pyodideReady.current) {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js"
      script.onload = async () => {
        // @ts-ignore
        const py = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" })
        pyodideReady.current = py
      }
      document.body.appendChild(script)
    }
  }, [])

  // Real Python execution
  const runPython = async (code: string): Promise<string> => {
    const py = await pyodideReady.current
    if (!py) return "Pyodide is still loading..."

    const output: string[] = []
    try {
      py.globals.set("capture_print", py.pyimport("io").StringIO())
      py.runPython(`
import sys
sys.stdout = capture_print
      `)

      await py.runPythonAsync(code)

      const stdout = py.globals.get("capture_print").getvalue()
      if (stdout) output.push(stdout)
    } catch (e: any) {
      output.push(`Error: ${e.message}`)
    } finally {
      py.runPython("import sys; sys.stdout = sys.__stdout__")
    }

    return output.length ? output.join("\n") : "Python code executed (no output)."
  }

  // Unified runCode for all languages
  const runCode = async () => {
    try {
      if (language === "javascript") {
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args: any[]) => logs.push(args.join(" "))
        // eslint-disable-next-line no-eval
        eval(code)
        console.log = originalLog
        setOutput(logs.length ? logs.join("\n") : "Code executed successfully!")
      }

      else if (language === "html") {
        const iframe = document.createElement("iframe")
        iframe.style.width = "100%"
        iframe.style.height = "100%"
        iframe.style.border = "none"
        const container = document.getElementById("html-preview")
        if (container) {
          container.innerHTML = ""
          container.appendChild(iframe)
          const doc = iframe.contentDocument!
          doc.open()
          doc.write(code)
          doc.close()
        }
        setOutput("HTML rendered below.")
      }

      else if (language === "css") {
        const preview = document.getElementById("css-preview")
        if (preview) {
          preview.innerHTML = `
            <style>${code}</style>
            <div class="demo p-6 text-center">
              <h1 class="text-3xl font-bold mb-2">Demo Text</h1>
              <p class="text-lg">Style me with CSS!</p>
              <button class="mt-4 px-6 py-2 bg-primary text-black rounded-lg">Click Me</button>
            </div>
          `
        }
        setOutput("CSS applied to demo below.")
      }

      else if (language === "python") {
        const result = await runPython(code)
        setOutput(result)
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || error}`)
    }
  }

  const loadLesson = (lessonIndex: number) => {
    setCurrentLesson(lessonIndex)
    const lesson = lessons[lessonIndex]
    const availableLanguages = Object.keys(lesson.languages) as Language[]
    const defaultLang = availableLanguages.includes(language) ? language : availableLanguages[0]
    setLanguage(defaultLang)
    setCode(lesson.languages[defaultLang]!.code)
    setOutput("")
  }

  const markComplete = () => {
    if (!completedLessons.includes(lessons[currentLesson].id)) {
      setCompletedLessons([...completedLessons, lessons[currentLesson].id])
    }
    if (currentLesson < lessons.length - 1) {
      loadLesson(currentLesson + 1)
    }
  }

  const openYoutube = (url: string) => {
    setYoutubeUrl(url)
    setShowYoutubeModal(true)
  }

  const switchLanguage = (lang: Language) => {
    const lesson = lessons[currentLesson]
    if (lesson.languages[lang]) {
      setLanguage(lang)
      setCode(lesson.languages[lang].code)
      setOutput("")
    }
  }

  const currentLessonData = lessons[currentLesson]
  const currentLessonLang = currentLessonData.languages[language]

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="pt-32 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-[1800px]">
          <Link
            to="/digitalhub"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Digital Hub
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Coding & <span className="text-primary">Software Development</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12">
            Learn HTML, CSS, JavaScript, and Python with hands-on coding and real execution.
          </p>

          <div className="mb-8 p-4 rounded-2xl bg-card border-2 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Learning Progress</span>
              <span className="text-sm font-bold text-primary">
                {completedLessons.length} / {lessons.length} Complete
              </span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            {/* Lessons Sidebar */}
            <div className="lg:col-span-3">
              <div className="p-6 rounded-3xl bg-card border-2 border-primary/30 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-4">Learning Path</h3>
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => loadLesson(index)}
                      className={`w-full p-3 rounded-xl transition-all text-left ${
                        currentLesson === index
                          ? "bg-primary text-black"
                          : "bg-black/50 hover:bg-primary/10 border border-primary/20 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            completedLessons.includes(lesson.id)
                              ? "bg-green-500 text-white"
                              : currentLesson === index
                                ? "bg-black text-primary"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {completedLessons.includes(lesson.id) ? "✓" : index + 1}
                        </div>
                        <span
                          className={`text-sm font-medium ${currentLesson === index ? "text-black" : "text-white"}`}
                        >
                          Lesson {index + 1}
                        </span>
                      </div>
                      <p className={`text-xs ${currentLesson === index ? "text-black/70" : "text-muted-foreground"}`}>
                        {lesson.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Editor & Output */}
            <div className="lg:col-span-9">
              <div className="mb-6 p-6 rounded-3xl bg-card border-2 border-primary/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{currentLessonData.title}</h2>
                    <p className="text-muted-foreground">{currentLessonData.description}</p>
                  </div>
                  <button
                    onClick={() => openYoutube(currentLessonData.youtubeUrl)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    <Youtube className="h-4 w-4" />
                    Watch Tutorial
                  </button>
                </div>

                {currentLessonLang && (
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-sm font-bold text-primary mb-1">Exercise:</p>
                    <p className="text-sm text-white">{currentLessonLang.exercise}</p>
                  </div>
                )}
              </div>

              {/* Code Editor */}
              <div className="p-6 rounded-3xl bg-card border-2 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Interactive Code Editor
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={runCode}
                      className="px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Run Code
                    </button>
                    <button
                      onClick={markComplete}
                      className="px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {currentLesson < lessons.length - 1 ? "Next Lesson" : "Complete"}
                    </button>
                  </div>
                </div>

                {/* Language Tabs */}
                <div className="flex gap-2 mb-4">
                  {(Object.keys(currentLessonData.languages) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => switchLanguage(lang)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        language === lang
                          ? "bg-primary text-black"
                          : "bg-black/50 text-muted-foreground hover:text-white border border-primary/20"
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Code Editor */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2 font-medium">Code Editor</label>
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full h-[500px] p-4 rounded-xl bg-black/50 border border-primary/20 text-white font-mono text-sm focus:outline-none focus:border-primary/50 resize-none"
                      spellCheck={false}
                    />
                  </div>

                  {/* Output / Preview */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2 font-medium">
                      {language === "html" ? "HTML Preview" : language === "css" ? "CSS Preview" : "Output Panel"}
                    </label>

                    {language === "html" && (
                      <div id="html-preview" className="h-[500px] bg-white rounded-xl overflow-hidden border border-primary/20" />
                    )}

                    {language === "css" && (
                      <div id="css-preview" className="h-[500px] bg-white rounded-xl p-4 overflow-auto border border-primary/20" />
                    )}

                    {language !== "html" && language !== "css" && (
                      <div className="w-full h-[500px] p-4 rounded-xl bg-black/50 border border-primary/20 text-primary font-mono text-sm overflow-auto whitespace-pre-wrap">
                        {output || "Click 'Run Code' to see the actual output..."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-3xl border-2 border-primary/30 p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Video Tutorial</h3>
              <button
                onClick={() => setShowYoutubeModal(false)}
                className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center p-4">
              <p className="text-muted-foreground text-center">
                YouTube video would load here: <br />
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  {youtubeUrl}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}