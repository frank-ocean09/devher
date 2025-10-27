import type React from "react"

import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import Navbar from "@/components/Utils/Navbar"
import {
  ArrowLeft,
  Palette,
  Figma,
  Box,
  ExternalLink,
  Square,
  Circle,
  Type,
  Download,
  Minus,
  ArrowRight,
  Star,
  Hexagon,
  ImageIcon,
  Trash2,
  Copy,
  Undo,
  Redo,
  ChevronUp,
  ChevronDown,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCw,
} from "lucide-react"
import Footer from "@/components/Utils/Footer"

type Shape = {
  id: string
  type: "rectangle" | "circle" | "text" | "line" | "arrow" | "polygon" | "star" | "image"
  x: number
  y: number
  width: number
  height: number
  color: string
  strokeColor?: string
  strokeWidth?: number
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: "normal" | "bold"
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline"
  textAlign?: "left" | "center" | "right"
  rotation?: number
  imageUrl?: string
  points?: number // for polygon/star
}

export default function Design() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [history, setHistory] = useState<Shape[][]>([[]]) // Added undo/redo history
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("#FFC5D3")
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#000000")
  const [selectedStrokeWidth] = useState(2)
  const [canvasBackground, setCanvasBackground] = useState("#FFFFFF")
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null) // Track selected shape
  const [resizingId, setResizingId] = useState<string | null>(null) // Track resizing shape
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveToHistory = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newShapes)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setShapes(newShapes)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setShapes(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setShapes(history[historyIndex + 1])
    }
  }

  const addShape = (type: Shape["type"]) => {
    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      x: Math.random() * 400 + 50,
      y: Math.random() * 200 + 50,
      width: type === "text" ? 150 : type === "line" || type === "arrow" ? 120 : 80,
      height: type === "text" ? 40 : type === "line" || type === "arrow" ? 4 : 80,
      color: selectedColor,
      strokeColor: selectedStrokeColor,
      strokeWidth: selectedStrokeWidth,
      text: type === "text" ? "Edit me" : undefined,
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      rotation: 0,
      points: type === "polygon" ? 6 : type === "star" ? 5 : undefined,
    }
    saveToHistory([...shapes, newShape])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const newShape: Shape = {
          id: `shape-${Date.now()}`,
          type: "image",
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          color: "#000000",
          imageUrl,
          rotation: 0,
        }
        saveToHistory([...shapes, newShape])
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent, shapeId: string, handle?: string) => {
    e.stopPropagation()
    const shape = shapes.find((s) => s.id === shapeId)
    if (!shape) return

    setSelectedShapeId(shapeId)

    if (handle) {
      setResizingId(shapeId)
      setResizeHandle(handle)
    } else {
      // Handle dragging
      const rect = e.currentTarget.getBoundingClientRect()
      setDraggingId(shapeId)
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      const canvas = e.currentTarget
      const rect = canvas.getBoundingClientRect()
      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y

      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === draggingId
            ? {
                ...shape,
                x: Math.max(0, Math.min(newX, rect.width - shape.width)),
                y: Math.max(0, Math.min(newY, rect.height - shape.height)),
              }
            : shape,
        ),
      )
    } else if (resizingId && resizeHandle) {
      const canvas = e.currentTarget
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setShapes((prevShapes) =>
        prevShapes.map((shape) => {
          if (shape.id === resizingId) {
            const newShape = { ...shape }
            if (resizeHandle.includes("e")) {
              newShape.width = Math.max(20, mouseX - shape.x)
            }
            if (resizeHandle.includes("s")) {
              newShape.height = Math.max(20, mouseY - shape.y)
            }
            if (resizeHandle.includes("w")) {
              const newWidth = Math.max(20, shape.x + shape.width - mouseX)
              newShape.x = mouseX
              newShape.width = newWidth
            }
            if (resizeHandle.includes("n")) {
              const newHeight = Math.max(20, shape.y + shape.height - mouseY)
              newShape.y = mouseY
              newShape.height = newHeight
            }
            return newShape
          }
          return shape
        }),
      )
    }
  }

  const handleMouseUp = () => {
    if (draggingId || resizingId) {
      saveToHistory(shapes)
    }
    setDraggingId(null)
    setResizingId(null)
    setResizeHandle(null)
  }

  const handleDoubleClick = (shape: Shape) => {
    if (shape.type === "text") {
      setEditingId(shape.id)
      setEditingText(shape.text || "")
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value)
    setShapes((prevShapes) =>
      prevShapes.map((shape) => (shape.id === editingId ? { ...shape, text: e.target.value } : shape)),
    )
  }

  const handleTextBlur = () => {
    setEditingId(null)
    saveToHistory(shapes)
  }

  const copyShape = () => {
    if (!selectedShapeId) return
    const shapeToCopy = shapes.find((s) => s.id === selectedShapeId)
    if (shapeToCopy) {
      const newShape = {
        ...shapeToCopy,
        id: `shape-${Date.now()}`,
        x: shapeToCopy.x + 20,
        y: shapeToCopy.y + 20,
      }
      saveToHistory([...shapes, newShape])
      setSelectedShapeId(newShape.id)
    }
  }

  const deleteShape = () => {
    if (!selectedShapeId) return
    saveToHistory(shapes.filter((s) => s.id !== selectedShapeId))
    setSelectedShapeId(null)
  }

  const bringForward = () => {
    if (!selectedShapeId) return
    const index = shapes.findIndex((s) => s.id === selectedShapeId)
    if (index < shapes.length - 1) {
      const newShapes = [...shapes]
      ;[newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]]
      saveToHistory(newShapes)
    }
  }

  const sendBackward = () => {
    if (!selectedShapeId) return
    const index = shapes.findIndex((s) => s.id === selectedShapeId)
    if (index > 0) {
      const newShapes = [...shapes]
      ;[newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]]
      saveToHistory(newShapes)
    }
  }

  const updateTextFormat = (property: keyof Shape, value: any) => {
    if (!selectedShapeId) return
    const newShapes = shapes.map((shape) => (shape.id === selectedShapeId ? { ...shape, [property]: value } : shape))
    saveToHistory(newShapes)
  }

  const rotateShape = () => {
    if (!selectedShapeId) return
    const newShapes = shapes.map((shape) =>
      shape.id === selectedShapeId ? { ...shape, rotation: ((shape.rotation || 0) + 45) % 360 } : shape,
    )
    saveToHistory(newShapes)
  }

  const saveDesign = () => {
    const design = {
      canvasBackground,
      shapes,
      timestamp: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(design, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `design-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToPNG = async () => {
    if (!canvasRef.current) return

    try {
      const newLocal = "html2canvas"
      const html2canvas = (await import(newLocal)).default
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: canvasBackground,
      })

      canvas.toBlob((blob: Blob | MediaSource) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `design-${Date.now()}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
      })
    } catch (error) {
      console.error("Error exporting to PNG:", error)
      alert("Failed to export to PNG. Please try again.")
    }
  }

  const renderShape = (shape: Shape) => {
    const transform = `rotate(${shape.rotation || 0}deg)`

    if (shape.type === "line" || shape.type === "arrow") {
      return (
        <svg
          style={{
            position: "absolute",
            left: shape.x,
            top: shape.y,
            width: shape.width,
            height: shape.height,
            transform,
            transformOrigin: "center",
          }}
        >
          <line
            x1="0"
            y1={shape.height / 2}
            x2={shape.width}
            y2={shape.height / 2}
            stroke={shape.strokeColor || shape.color}
            strokeWidth={shape.strokeWidth || 2}
          />
          {shape.type === "arrow" && (
            <polygon
              points={`${shape.width},${shape.height / 2} ${shape.width - 10},${shape.height / 2 - 5} ${shape.width - 10},${shape.height / 2 + 5}`}
              fill={shape.strokeColor || shape.color}
            />
          )}
        </svg>
      )
    }

    if (shape.type === "polygon" || shape.type === "star") {
      const points = shape.points || 6
      const centerX = shape.width / 2
      const centerY = shape.height / 2
      const radius = Math.min(shape.width, shape.height) / 2

      let pathPoints = ""
      if (shape.type === "polygon") {
        for (let i = 0; i < points; i++) {
          const angle = (i * 2 * Math.PI) / points - Math.PI / 2
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)
          pathPoints += `${x},${y} `
        }
      } else {
        // Star
        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points - Math.PI / 2
          const r = i % 2 === 0 ? radius : radius / 2
          const x = centerX + r * Math.cos(angle)
          const y = centerY + r * Math.sin(angle)
          pathPoints += `${x},${y} `
        }
      }

      return (
        <svg
          style={{
            position: "absolute",
            left: shape.x,
            top: shape.y,
            width: shape.width,
            height: shape.height,
            transform,
            transformOrigin: "center",
          }}
        >
          <polygon
            points={pathPoints}
            fill={shape.color}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth || 0}
          />
        </svg>
      )
    }

    if (shape.type === "image" && shape.imageUrl) {
      return (
        <img
          src={shape.imageUrl || "/placeholder.svg"}
          alt="Uploaded"
          style={{
            position: "absolute",
            left: shape.x,
            top: shape.y,
            width: shape.width,
            height: shape.height,
            objectFit: "cover",
            borderRadius: "8px",
            transform,
            transformOrigin: "center",
          }}
        />
      )
    }

    // Rectangle, Circle, Text
    return (
      <div
        style={{
          position: "absolute",
          left: shape.x,
          top: shape.y,
          width: shape.width,
          height: shape.height,
          backgroundColor: shape.type !== "text" ? shape.color : "transparent",
          border:
            shape.strokeWidth && shape.strokeWidth > 0 ? `${shape.strokeWidth}px solid ${shape.strokeColor}` : "none",
          borderRadius: shape.type === "circle" ? "50%" : "8px",
          color: shape.type === "text" ? shape.color : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: shape.textAlign || "center",
          fontWeight: shape.fontWeight || "normal",
          fontSize: `${shape.fontSize || 18}px`,
          fontFamily: shape.fontFamily || "Arial",
          fontStyle: shape.fontStyle || "normal",
          textDecoration: shape.textDecoration || "none",
          padding: shape.type === "text" ? "8px" : "0",
          transform,
          transformOrigin: "center",
        }}
      >
        {shape.type === "text" && editingId === shape.id ? (
          <input
            type="text"
            value={editingText}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            autoFocus
            className="w-full h-full bg-transparent outline-none"
            style={{
              color: shape.color,
              fontWeight: shape.fontWeight,
              fontSize: `${shape.fontSize}px`,
              fontFamily: shape.fontFamily,
              fontStyle: shape.fontStyle,
              textDecoration: shape.textDecoration,
              textAlign: shape.textAlign,
            }}
          />
        ) : (
          shape.text
        )}
      </div>
    )
  }

  const tutorials = [
    {
      title: "Using Canva for Prototyping",
      description: "Learn to create beautiful designs and prototypes with Canva's free tools.",
      icon: Palette,
      link: "https://www.canva.com/learn/",
    },
    {
      title: "Figma for UI Mockups",
      description: "Design professional user interfaces and collaborate with your team.",
      icon: Figma,
      link: "https://help.figma.com/hc/en-us/categories/360002051613-Get-started",
    },
    {
      title: "Intro to TinkerCAD 3D Modeling",
      description: "Create 3D models and prepare them for 3D printing.",
      icon: Box,
      link: "https://www.tinkercad.com/learn",
    },
  ]

  const projects = [
    {
      title: "Mobile App Mockup",
      description: "A complete mobile app design with multiple screens",
      image: "/mobile-app-design-mockup.jpg",
    },
    {
      title: "3D Printed Keychain",
      description: "Custom designed keychain ready for 3D printing",
      image: "/3d-printed-keychain-design.jpg",
    },
    {
      title: "Logo Design",
      description: "Professional logo design for a tech startup",
      image: "/tech-startup-logo-design.jpg",
    },
  ]

  const colors = ["#FFC5D3", "#000000", "#FFFFFF", "#FF6B9D", "#C9184A", "#FFD60A", "#06FFA5"]

  const lessons = [
    "What is Design?",
    "Color & Typography Basics",
    "Using Canva/Figma",
    "Create Your Own Logo",
    "Layout & Composition",
  ]

  const selectedShape = shapes.find((s) => s.id === selectedShapeId)

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <section className="pt-32 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <Link
            to="/digitalhub"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Digital Hub
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Design & <span className="text-primary">3D Printing</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12">
            Create beautiful designs with our interactive canvas.
          </p>

          {/* Design Canvas */}
          <div className="mb-16 p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-2xl font-bold text-white mb-6">Design Canvas</h2>

            <div className="mb-4 p-4 rounded-2xl bg-black/50 border border-primary/20 space-y-4">
              {/* Shape Tools */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Shape Tools:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addShape("rectangle")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <Square className="h-4 w-4" />
                    Rectangle
                  </button>
                  <button
                    onClick={() => addShape("circle")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <Circle className="h-4 w-4" />
                    Circle
                  </button>
                  <button
                    onClick={() => addShape("line")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <Minus className="h-4 w-4" />
                    Line
                  </button>
                  <button
                    onClick={() => addShape("arrow")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Arrow
                  </button>
                  <button
                    onClick={() => addShape("polygon")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <Hexagon className="h-4 w-4" />
                    Polygon
                  </button>
                  <button
                    onClick={() => addShape("star")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <Star className="h-4 w-4" />
                    Star
                  </button>
                  <button
                    onClick={() => addShape("text")}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <Type className="h-4 w-4" />
                    Text
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Color Tools */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Fill Color:</p>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          selectedColor === color ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Stroke Color:</p>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={`stroke-${color}`}
                        onClick={() => setSelectedStrokeColor(color)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          selectedStrokeColor === color
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Canvas Background:</p>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={`bg-${color}`}
                        onClick={() => setCanvasBackground(color)}
                        className={`w-8 h-8 rounded-lg transition-all ${
                          canvasBackground === color
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Edit Tools */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Edit Tools:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex === 0}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Undo className="h-4 w-4" />
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex === history.length - 1}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Redo className="h-4 w-4" />
                    Redo
                  </button>
                  <button
                    onClick={copyShape}
                    disabled={!selectedShapeId}
                    className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                  <button
                    onClick={deleteShape}
                    disabled={!selectedShapeId}
                    className="px-3 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Layer Tools */}
              {selectedShapeId && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Layer Order:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={bringForward}
                      className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                    >
                      <ChevronUp className="h-4 w-4" />
                      Bring Forward
                    </button>
                    <button
                      onClick={sendBackward}
                      className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                    >
                      <ChevronDown className="h-4 w-4" />
                      Send Backward
                    </button>
                    <button
                      onClick={rotateShape}
                      className="px-3 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex items-center gap-2 text-sm"
                    >
                      <RotateCw className="h-4 w-4" />
                      Rotate 45°
                    </button>
                  </div>
                </div>
              )}

              {/* Text Formatting Tools */}
              {selectedShape && selectedShape.type === "text" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Text Formatting:</p>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={selectedShape.fontFamily || "Arial"}
                      onChange={(e) => updateTextFormat("fontFamily", e.target.value)}
                      className="px-3 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 text-sm"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                    <input
                      type="number"
                      value={selectedShape.fontSize || 18}
                      onChange={(e) => updateTextFormat("fontSize", Number.parseInt(e.target.value))}
                      className="w-20 px-3 py-2 rounded-xl bg-primary/20 text-primary border border-primary/30 text-sm"
                      min="8"
                      max="72"
                    />
                    <button
                      onClick={() =>
                        updateTextFormat("fontWeight", selectedShape.fontWeight === "bold" ? "normal" : "bold")
                      }
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        selectedShape.fontWeight === "bold"
                          ? "bg-primary text-black"
                          : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                      }`}
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        updateTextFormat("fontStyle", selectedShape.fontStyle === "italic" ? "normal" : "italic")
                      }
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        selectedShape.fontStyle === "italic"
                          ? "bg-primary text-black"
                          : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                      }`}
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        updateTextFormat(
                          "textDecoration",
                          selectedShape.textDecoration === "underline" ? "none" : "underline",
                        )
                      }
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        selectedShape.textDecoration === "underline"
                          ? "bg-primary text-black"
                          : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                      }`}
                    >
                      <Underline className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateTextFormat("textAlign", "left")}
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        selectedShape.textAlign === "left"
                          ? "bg-primary text-black"
                          : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                      }`}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateTextFormat("textAlign", "center")}
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        selectedShape.textAlign === "center"
                          ? "bg-primary text-black"
                          : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                      }`}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateTextFormat("textAlign", "right")}
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        selectedShape.textAlign === "right"
                          ? "bg-primary text-black"
                          : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                      }`}
                    >
                      <AlignRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="rounded-2xl p-8 min-h-[400px] relative overflow-hidden cursor-default"
              style={{ backgroundColor: canvasBackground }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedShapeId(null)}
            >
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  className="absolute"
                  style={{
                    left: shape.x,
                    top: shape.y,
                    width: shape.width,
                    height: shape.height,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedShapeId(shape.id)
                  }}
                >
                  <div
                    className="cursor-move transition-all hover:scale-105 select-none"
                    onMouseDown={(e) => handleMouseDown(e, shape.id)}
                    onDoubleClick={() => handleDoubleClick(shape)}
                  >
                    {renderShape(shape)}
                  </div>

                  {selectedShapeId === shape.id && shape.type !== "line" && shape.type !== "arrow" && (
                    <>
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-nwse-resize -top-1.5 -left-1.5"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "nw")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-ns-resize -top-1.5 left-1/2 -translate-x-1/2"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "n")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-nesw-resize -top-1.5 -right-1.5"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "ne")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-ew-resize top-1/2 -translate-y-1/2 -right-1.5"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "e")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-nwse-resize -bottom-1.5 -right-1.5"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "se")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-ns-resize -bottom-1.5 left-1/2 -translate-x-1/2"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "s")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-nesw-resize -bottom-1.5 -left-1.5"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "sw")}
                      />
                      <div
                        className="absolute w-3 h-3 bg-primary rounded-full cursor-ew-resize top-1/2 -translate-y-1/2 -left-1.5"
                        onMouseDown={(e) => handleMouseDown(e, shape.id, "w")}
                      />
                    </>
                  )}
                </div>
              ))}
              {shapes.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Add shapes to start designing (double-click text to edit, drag to move, use handles to resize)
                </div>
              )}
            </div>

            {/* Save and Export Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShapes([])
                  saveToHistory([])
                }}
                className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all font-medium"
              >
                Clear Canvas
              </button>
              <button
                onClick={saveDesign}
                className="px-6 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all font-medium flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Save JSON
              </button>
              <button
                onClick={exportToPNG}
                className="px-6 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all font-medium flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export PNG
              </button>
            </div>
          </div>

          {/* Tutorials */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Design Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => {
                const Icon = tutorial.icon
                return (
                  <a
                    key={tutorial.title}
                    href={tutorial.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-6 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{tutorial.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{tutorial.description}</p>
                    <div className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                      Start Learning
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Learning Path */}
          <div className="mb-16 p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-2xl font-bold text-white mb-6">Learning Path</h2>
            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-black/50 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-black transition-colors">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{lesson}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Example Projects Gallery */}
          <div className="p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-2xl font-bold text-white mb-6">Example Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="group rounded-2xl overflow-hidden bg-black/50 border border-primary/20 hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
