import type React from "react"
import { useState, useRef, useEffect } from "react"
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
  textColor?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: "normal" | "bold"
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline"
  textAlign?: "left" | "center" | "right"
  rotation?: number
  imageUrl?: string
  points?: number
}

export default function Design() {
  const [shapes, setShapes] = useState<Shape[]>([])
  const [history, setHistory] = useState<Shape[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState("#FFC5D3")
  const [selectedStrokeColor, setSelectedStrokeColor] = useState("#000000")
  const [selectedTextColor, setSelectedTextColor] = useState("#000000")
  const [selectedStrokeWidth] = useState(2)
  const [canvasBackground, setCanvasBackground] = useState("#FFFFFF")
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null)
  const [resizingId, setResizingId] = useState<string | null>(null)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [rotatingId, setRotatingId] = useState<string | null>(null)
  const [rotateStartAngle, setRotateStartAngle] = useState(0)
  const [rotateStartRotation, setRotateStartRotation] = useState(0)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveToHistory = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newShapes)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
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
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const centerX = (rect.width - 100) / 2
    const centerY = (rect.height - 100) / 2

    const newShape: Shape = {
      id: `shape-${Date.now()}`,
      type,
      x: centerX,
      y: centerY,
      width: type === "text" ? 150 : type === "line" || type === "arrow" ? 120 : 80,
      height: type === "text" ? 40 : type === "line" || type === "arrow" ? 4 : 80,
      color: selectedColor,
      strokeColor: selectedStrokeColor,
      strokeWidth: selectedStrokeWidth,
      text: type === "text" ? "Edit me" : undefined,
      textColor: selectedTextColor,
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "center",
      rotation: 0,
      points: type === "polygon" ? 6 : type === "star" ? 5 : undefined,
    }
    const newShapes = [...shapes, newShape]
    setShapes(newShapes)
    saveToHistory(newShapes)
    setSelectedShapeId(newShape.id)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && canvasRef.current) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const rect = canvasRef.current!.getBoundingClientRect()
        const centerX = (rect.width - 150) / 2
        const centerY = (rect.height - 150) / 2
        const newShape: Shape = {
          id: `shape-${Date.now()}`,
          type: "image",
          x: centerX,
          y: centerY,
          width: 150,
          height: 150,
          color: "#000000",
          imageUrl,
          rotation: 0,
        }
        const newShapes = [...shapes, newShape]
        setShapes(newShapes)
        saveToHistory(newShapes)
        setSelectedShapeId(newShape.id)
      }
      reader.readAsDataURL(file)
    }
  }

  const getAngle = (cx: number, cy: number, ex: number, ey: number) => {
    const dy = ey - cy
    const dx = ex - cx
    let theta = Math.atan2(dy, dx)
    theta *= 180 / Math.PI
    return theta
  }

  const handleMouseDown = (e: React.MouseEvent, shapeId: string, handle?: string) => {
    e.stopPropagation()
    const shape = shapes.find((s) => s.id === shapeId)
    if (!shape) return

    setSelectedShapeId(shapeId)

    if (handle === "rotate") {
      setRotatingId(shapeId)
      const rect = canvasRef.current!.getBoundingClientRect()
      const centerX = shape.x + shape.width / 2 + rect.left
      const centerY = shape.y + shape.height / 2 + rect.top
      const angle = getAngle(centerX, centerY, e.clientX, e.clientY)
      setRotateStartAngle(angle)
      setRotateStartRotation(shape.rotation || 0)
    } else if (handle && handle !== "move") {
      setResizingId(shapeId)
      setResizeHandle(handle)
    } else {
      const rect = e.currentTarget.getBoundingClientRect()
      setDraggingId(shapeId)
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    if (draggingId) {
      const newX = e.clientX - rect.left - dragOffset.x
      const newY = e.clientY - rect.top - dragOffset.y
      setShapes((prev) =>
        prev.map((s) =>
          s.id === draggingId
            ? {
                ...s,
                x: Math.max(0, Math.min(newX, rect.width - s.width)),
                y: Math.max(0, Math.min(newY, rect.height - s.height)),
              }
            : s
        )
      )
    } else if (resizingId && resizeHandle) {
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      setShapes((prev) =>
        prev.map((s) => {
          if (s.id === resizingId) {
            const newShape = { ...s }

            if (resizeHandle === "e") newShape.width = Math.max(20, mouseX - s.x)
            if (resizeHandle === "w") {
              const newWidth = Math.max(20, s.x + s.width - mouseX)
              newShape.x = mouseX
              newShape.width = newWidth
            }
            if (resizeHandle === "s") newShape.height = Math.max(20, mouseY - s.y)
            if (resizeHandle === "n") {
              const newHeight = Math.max(20, s.y + s.height - mouseY)
              newShape.y = mouseY
              newShape.height = newHeight
            }
            if (resizeHandle === "ne") {
              newShape.width = Math.max(20, mouseX - s.x)
              const newHeight = Math.max(20, s.y + s.height - mouseY)
              newShape.y = mouseY
              newShape.height = newHeight
            }
            if (resizeHandle === "nw") {
              const newWidth = Math.max(20, s.x + s.width - mouseX)
              newShape.x = mouseX
              newShape.width = newWidth
              const newHeight = Math.max(20, s.y + s.height - mouseY)
              newShape.y = mouseY
              newShape.height = newHeight
            }
            if (resizeHandle === "se") {
              newShape.width = Math.max(20, mouseX - s.x)
              newShape.height = Math.max(20, mouseY - s.y)
            }
            if (resizeHandle === "sw") {
              const newWidth = Math.max(20, s.x + s.width - mouseX)
              newShape.x = mouseX
              newShape.width = newWidth
              newShape.height = Math.max(20, mouseY - s.y)
            }

            return newShape
          }
          return s
        })
      )
    } else if (rotatingId) {
      const shape = shapes.find((s) => s.id === rotatingId)!
      const centerX = shape.x + shape.width / 2 + rect.left
      const centerY = shape.y + shape.height / 2 + rect.top
      const currentAngle = getAngle(centerX, centerY, e.clientX, e.clientY)
      const delta = currentAngle - rotateStartAngle
      const newRotation = (rotateStartRotation + delta) % 360
      setShapes((prev) =>
        prev.map((s) => (s.id === rotatingId ? { ...s, rotation: newRotation } : s))
      )
    }
  }

  const handleMouseUp = () => {
    if (draggingId || resizingId || rotatingId) {
      saveToHistory(shapes)
    }
    setDraggingId(null)
    setResizingId(null)
    setResizeHandle(null)
    setRotatingId(null)
  }

  const handleDoubleClick = (shape: Shape) => {
    if (shape.type === "text") {
      setEditingId(shape.id)
      setEditingText(shape.text || "")
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value)
    setShapes((prev) =>
      prev.map((s) => (s.id === editingId ? { ...s, text: e.target.value } : s))
    )
  }

  const handleTextBlur = () => {
    setEditingId(null)
    saveToHistory(shapes)
  }

  const copyShape = () => {
    if (!selectedShapeId) return
    const shape = shapes.find((s) => s.id === selectedShapeId)!
    const newShape = { ...shape, id: `shape-${Date.now()}`, x: shape.x + 20, y: shape.y + 20 }
    const newShapes = [...shapes, newShape]
    setShapes(newShapes)
    saveToHistory(newShapes)
    setSelectedShapeId(newShape.id)
  }

  const deleteShape = () => {
    if (!selectedShapeId) return
    const newShapes = shapes.filter((s) => s.id !== selectedShapeId)
    setShapes(newShapes)
    saveToHistory(newShapes)
    setSelectedShapeId(null)
  }

  const bringForward = () => {
    if (!selectedShapeId) return
    const index = shapes.findIndex((s) => s.id === selectedShapeId)
    if (index < shapes.length - 1) {
      const newShapes = [...shapes]
      ;[newShapes[index], newShapes[index + 1]] = [newShapes[index + 1], newShapes[index]]
      setShapes(newShapes)
      saveToHistory(newShapes)
    }
  }

  const sendBackward = () => {
    if (!selectedShapeId) return
    const index = shapes.findIndex((s) => s.id === selectedShapeId)
    if (index > 0) {
      const newShapes = [...shapes]
      ;[newShapes[index], newShapes[index - 1]] = [newShapes[index - 1], newShapes[index]]
      setShapes(newShapes)
      saveToHistory(newShapes)
    }
  }

  const updateShapeProperty = (property: keyof Shape, value: any) => {
    if (!selectedShapeId) return
    const newShapes = shapes.map((s) =>
      s.id === selectedShapeId ? { ...s, [property]: value } : s
    )
    setShapes(newShapes)
  }

  const rotateShape = () => {
    if (!selectedShapeId) return
    const newShapes = shapes.map((s) =>
      s.id === selectedShapeId
        ? { ...s, rotation: ((s.rotation || 0) + 45) % 360 }
        : s
    )
    setShapes(newShapes)
    saveToHistory(newShapes)
  }

  // ──────────────────────────────────────────────────────────────
  //  ONLY update the SELECTED shape when color changes
  // ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedShapeId) {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === selectedShapeId ? { ...s, color: selectedColor } : s
        )
      )
    }
  }, [selectedColor, selectedShapeId])

  useEffect(() => {
    if (selectedShapeId) {
      setShapes((prev) =>
        prev.map((s) =>
          s.id === selectedShapeId ? { ...s, strokeColor: selectedStrokeColor } : s
        )
      )
    }
  }, [selectedStrokeColor, selectedShapeId])

  useEffect(() => {
    if (selectedShapeId) {
      const shape = shapes.find((s) => s.id === selectedShapeId)
      if (shape?.type === "text") {
        setShapes((prev) =>
          prev.map((s) =>
            s.id === selectedShapeId ? { ...s, textColor: selectedTextColor } : s
          )
        )
      }
    }
  }, [selectedTextColor, selectedShapeId, shapes])

  // ──────────────────────────────────────────────────────────────
  //  EXPORT TO PNG – ALL SHAPES, NO ERRORS
  // ──────────────────────────────────────────────────────────────
  const exportToPNG = async () => {
    if (!canvasRef.current || shapes.length === 0) {
      alert("Add at least one shape to export!")
      return
    }

    const btn = document.getElementById("export-btn")
    const original = btn?.innerHTML
    if (btn) btn.innerHTML = "Exporting…"

    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Canvas 2D context not supported")

      const { width, height } = canvasRef.current.getBoundingClientRect()
      canvas.width = width * 2
      canvas.height = height * 2
      ctx.scale(2, 2)
      ctx.fillStyle = canvasBackground
      ctx.fillRect(0, 0, width, height)

      for (const shape of shapes) {
        ctx.save()
        const cx = shape.x + shape.width / 2
        const cy = shape.y + shape.height / 2
        ctx.translate(cx, cy)
        ctx.rotate((shape.rotation || 0) * (Math.PI / 180))
        ctx.translate(-cx, -cy)

        // Rectangle / Circle
        if (shape.type === "rectangle" || shape.type === "circle") {
          ctx.fillStyle = shape.color
          ctx.strokeStyle = shape.strokeColor || "transparent"
          ctx.lineWidth = shape.strokeWidth || 0
          if (shape.type === "circle") {
            ctx.beginPath()
            ctx.ellipse(cx, cy, shape.width / 2, shape.height / 2, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
          } else {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
          }
        }

        // Text
        else if (shape.type === "text" && shape.text) {
          ctx.font = `${shape.fontWeight === "bold" ? "bold " : ""}${
            shape.fontStyle === "italic" ? "italic " : ""
          }${shape.fontSize}px ${shape.fontFamily}`
          ctx.fillStyle = shape.textColor || "#000"
          ctx.textAlign = (shape.textAlign as CanvasTextAlign) || "center"
          ctx.textBaseline = "middle"
          ctx.fillText(shape.text, cx, cy)
        }

        // Line / Arrow
        else if ((shape.type === "line" || shape.type === "arrow") && shape.strokeColor) {
          ctx.strokeStyle = shape.strokeColor
          ctx.lineWidth = shape.strokeWidth || 2
          const y = shape.y + shape.height / 2
          ctx.beginPath()
          ctx.moveTo(shape.x, y)
          ctx.lineTo(shape.x + shape.width, y)
          ctx.stroke()

          if (shape.type === "arrow") {
            const headLen = 10
            ctx.beginPath()
            ctx.moveTo(shape.x + shape.width, y)
            ctx.lineTo(shape.x + shape.width - headLen, y - headLen / 2)
            ctx.lineTo(shape.x + shape.width - headLen, y + headLen / 2)
            ctx.closePath()
            ctx.fillStyle = shape.strokeColor
            ctx.fill()
          }
        }

        // Polygon / Star
        else if (shape.type === "polygon" || shape.type === "star") {
          const points = shape.points || 6
          const radius = Math.min(shape.width, shape.height) / 2
          const centerX = shape.x + shape.width / 2
          const centerY = shape.y + shape.height / 2

          ctx.fillStyle = shape.color
          ctx.strokeStyle = shape.strokeColor || "transparent"
          ctx.lineWidth = shape.strokeWidth || 0

          ctx.beginPath()
          for (let i = 0; i < (shape.type === "star" ? points * 2 : points); i++) {
            const angle = (i * (shape.type === "star" ? Math.PI : 2 * Math.PI)) / points - Math.PI / 2
            const r = shape.type === "star" && i % 2 === 1 ? radius / 2 : radius
            const px = centerX + r * Math.cos(angle)
            const py = centerY + r * Math.sin(angle)
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.fill()
          ctx.stroke()
        }

        // Image (safe)
        else if (shape.type === "image" && shape.imageUrl) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          const loadPromise = new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error("Image load failed"))
          })
          img.src = shape.imageUrl
          try {
            await loadPromise
            ctx.drawImage(img, shape.x, shape.y, shape.width, shape.height)
          } catch {
            ctx.fillStyle = "#e5e5e5"
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
            ctx.fillStyle = "#666"
            ctx.font = "14px Arial"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("Image", cx, cy)
          }
        }

        ctx.restore()
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `design-${Date.now()}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
      }, "image/png")
    } catch (err) {
      console.error(err)
      alert("Export failed.")
    } finally {
      if (btn && original) btn.innerHTML = original
    }
  }

  const renderShape = (shape: Shape) => {
    const transform = `rotate(${shape.rotation || 0}deg)`

    if (shape.type === "line" || shape.type === "arrow") {
      return (
        <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform, transformOrigin: "center" }}>
          <line x1="0" y1={shape.height / 2} x2={shape.width} y2={shape.height / 2} stroke={shape.strokeColor || shape.color} strokeWidth={shape.strokeWidth || 2} />
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
        for (let i = 0; i < points * 2; i++) {
          const angle = (i * Math.PI) / points - Math.PI / 2
          const r = i % 2 === 0 ? radius : radius / 2
          const x = centerX + r * Math.cos(angle)
          const y = centerY + r * Math.sin(angle)
          pathPoints += `${x},${y} `
        }
      }
      return (
        <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", transform, transformOrigin: "center" }}>
          <polygon points={pathPoints} fill={shape.color} stroke={shape.strokeColor} strokeWidth={shape.strokeWidth || 0} />
        </svg>
      )
    }

    if (shape.type === "image" && shape.imageUrl) {
      return (
        <img
          src={shape.imageUrl}
          alt="Uploaded"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
            transform,
            transformOrigin: "center",
          }}
          crossOrigin="anonymous"
        />
      )
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: shape.type !== "text" ? shape.color : "transparent",
          border: shape.strokeWidth && shape.strokeWidth > 0 ? `${shape.strokeWidth}px solid ${shape.strokeColor}` : "none",
          borderRadius: shape.type === "circle" ? "50%" : "8px",
          color: shape.type === "text" ? (shape.textColor || "#000000") : "transparent",
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
            className="w-full h-full bg-transparent outline-none text-inherit text-center"
            style={{
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
    { title: "Using Canva for Prototyping", description: "Learn to create beautiful designs...", icon: Palette, link: "https://www.canva.com/learn/" },
    { title: "Figma for UI Mockups", description: "Design professional user interfaces...", icon: Figma, link: "https://help.figma.com" },
    { title: "Intro to TinkerCAD 3D Modeling", description: "Create 3D models...", icon: Box, link: "https://www.tinkercad.com/learn" },
  ]

  const projects = [
    { title: "Mobile App Mockup", description: "A complete mobile app design...", image: "/mobile-app-design-mockup.jpg" },
    { title: "3D Printed Keychain", description: "Custom designed keychain...", image: "/3d-printed-keychain-design.jpg" },
    { title: "Logo Design", description: "Professional logo design...", image: "/tech-startup-logo-design.jpg" },
  ]

  const colors = ["#FFC5D3", "#000000", "#FFFFFF", "#FF6B9D", "#C9184A", "#FFD60A", "#06FFA5"]
  const lessons = ["What is Design?", "Color & Typography Basics", "Using Canva/Figma", "Create Your Own Logo", "Layout & Composition"]
  const selectedShape = shapes.find((s) => s.id === selectedShapeId)

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <Link to="/digitalhub" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 text-sm sm:text-base transition-colors">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Back to Digital Hub
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Design & <span className="text-primary">3D Printing</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-3xl">
            Create beautiful designs with our interactive canvas.
          </p>

          {/* Canvas Section */}
          <div className="mb-12 p-4 sm:p-6 lg:p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Design Canvas</h2>

            {/* Toolbar */}
            <div className="mb-5 p-4 rounded-2xl bg-black/50 border border-primary/20 space-y-5">
              {/* Shape Tools */}
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Shape Tools:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[
                    { icon: Square, label: "Rect", type: "rectangle" },
                    { icon: Circle, label: "Circle", type: "circle" },
                    { icon: Minus, label: "Line", type: "line" },
                    { icon: ArrowRight, label: "Arrow", type: "arrow" },
                    { icon: Hexagon, label: "Poly", type: "polygon" },
                    { icon: Star, label: "Star", type: "star" },
                    { icon: Type, label: "Text", type: "text" },
                    { icon: ImageIcon, label: "Img", onClick: () => fileInputRef.current?.click() },
                  ].map(({ icon: Icon, label, type, onClick }) => (
                    <button
                      key={type || label}
                      onClick={onClick || (() => addShape(type as Shape["type"]))}
                      className="px-2 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all flex flex-col items-center gap-1 text-xs"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>

              {/* Color Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { label: "Fill", value: selectedColor, set: setSelectedColor },
                  { label: "Stroke", value: selectedStrokeColor, set: setSelectedStrokeColor },
                  { label: "Text", value: selectedTextColor, set: setSelectedTextColor },
                  { label: "Canvas", value: canvasBackground, set: setCanvasBackground },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground mb-1">{label}:</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => set(c)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all ${value === c ? "ring-2 ring-primary ring-offset-2 ring-offset-black scale-110" : ""}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Tools */}
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Undo, label: "Undo", onClick: undo, disabled: historyIndex === 0 },
                  { icon: Redo, label: "Redo", onClick: redo, disabled: historyIndex === history.length - 1 },
                  { icon: Copy, label: "Copy", onClick: copyShape, disabled: !selectedShapeId },
                  { icon: Trash2, label: "Delete", onClick: deleteShape, disabled: !selectedShapeId, className: "text-red-400 hover:bg-red-500/30" },
                ].map(({ icon: Icon, label, onClick, disabled, className }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    disabled={disabled}
                    className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${disabled ? "opacity-50 cursor-not-allowed" : ""} bg-primary/20 text-primary hover:bg-primary hover:text-black ${className || ""}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {selectedShapeId && (
                <div className="flex flex-wrap gap-2">
                  <button onClick={bringForward} className="px-2.5 py-1.5 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black text-xs flex items-center gap-1.5">
                    <ChevronUp className="h-3.5 w-3.5" /> Forward
                  </button>
                  <button onClick={sendBackward} className="px-2.5 py-1.5 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black text-xs flex items-center gap-1.5">
                    <ChevronDown className="h-3.5 w-3.5" /> Backward
                  </button>
                  <button onClick={rotateShape} className="px-2.5 py-1.5 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black text-xs flex items-center gap-1.5">
                    <RotateCw className="h-3.5 w-3.5" /> Rotate +45°
                  </button>
                </div>
              )}

              {/* Text Formatting */}
              {selectedShape?.type === "text" && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <select
                    value={selectedShape.fontFamily || "Arial"}
                    onChange={(e) => updateShapeProperty("fontFamily", e.target.value)}
                    className="px-2 py-1.5 rounded-xl bg-primary/20 text-primary border border-primary/30 text-xs"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times</option>
                    <option value="Courier New">Courier</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                  <input
                    type="number"
                    value={selectedShape.fontSize || 18}
                    onChange={(e) => updateShapeProperty("fontSize", Number.parseInt(e.target.value))}
                    className="w-16 px-2 py-1.5 rounded-xl bg-primary/20 text-primary border border-primary/30 text-xs"
                    min="8"
                    max="72"
                  />
                  {["bold", "italic", "underline", "left", "center", "right"].map((prop) => {
                    const icons: Record<string, any> = {
                      bold: Bold,
                      italic: Italic,
                      underline: Underline,
                      left: AlignLeft,
                      center: AlignCenter,
                      right: AlignRight,
                    }
                    const Icon = icons[prop]
                    const key =
                      prop === "left" || prop === "center" || prop === "right"
                        ? "textAlign"
                        : prop === "bold"
                        ? "fontWeight"
                        : prop === "italic"
                        ? "fontStyle"
                        : "textDecoration"
                    const current = selectedShape[key]
                    const target =
                      prop === "left" || prop === "center" || prop === "right"
                        ? prop
                        : prop === "bold"
                        ? "bold"
                        : prop === "italic"
                        ? "italic"
                        : "underline"

                    return (
                      <button
                        key={prop}
                        onClick={() =>
                          updateShapeProperty(
                            key,
                            current === target
                              ? key === "textAlign"
                                ? "center"
                                : "normal"
                              : target
                          )
                        }
                        className={`p-1.5 rounded-xl transition-all ${
                          current === target
                            ? "bg-primary text-black"
                            : "bg-primary/20 text-primary hover:bg-primary hover:text-black"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Canvas */}
            <div
              ref={canvasRef}
              className="rounded-2xl p-4 sm:p-6 min-h-80 sm:min-h-96 lg:min-h-[500px] relative overflow-hidden cursor-default"
              style={{ backgroundColor: canvasBackground }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={() => setSelectedShapeId(null)}
            >
              {shapes.map((shape) => {
                const isSelected = selectedShapeId === shape.id
                const isResizable = isSelected && !["line", "arrow"].includes(shape.type)
                const rotation = shape.rotation || 0

                return (
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
                      className="w-full h-full cursor-move select-none"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        transformOrigin: "center",
                      }}
                      onMouseDown={(e) => handleMouseDown(e, shape.id, "move")}
                      onDoubleClick={() => handleDoubleClick(shape)}
                    >
                      {renderShape(shape)}
                    </div>

                    {isResizable && (
                      <div className="absolute inset-0 pointer-events-none">
                        {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => {
                          const isCorner = ["nw", "ne", "se", "sw"].includes(h)
                          const size = isCorner ? "w-3 h-3" : "w-2.5 h-2.5"
                          return (
                            <div
                              key={h}
                              className={`absolute ${size} bg-white border-2 border-primary rounded-full pointer-events-auto cursor-${h}-resize shadow-md`}
                              style={{
                                top: h.includes("n") ? "-6px" : h.includes("s") ? "auto" : "50%",
                                bottom: h.includes("s") ? "-6px" : "auto",
                                left: h.includes("w") ? "-6px" : h.includes("e") ? "auto" : "50%",
                                right: h.includes("e") ? "-6px" : "auto",
                                marginTop: h.includes("n") ? 0 : h === "n" || h === "s" ? "-50%" : 0,
                                marginLeft: h.includes("w") ? 0 : h === "w" || h === "e" ? "-50%" : 0,
                              }}
                              onMouseDown={(e) => handleMouseDown(e, shape.id, h)}
                            />
                          )
                        })}

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-none">
                          <div className="w-px h-8 bg-primary/50" />
                          <div
                            className="w-6 h-6 bg-white border-2 border-primary rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow-lg flex items-center justify-center"
                            onMouseDown={(e) => handleMouseDown(e, shape.id, "rotate")}
                          >
                            <RotateCw className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {shapes.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400 text-xs sm:text-sm text-center px-4">
                  Add shapes to start designing
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <button onClick={() => { setShapes([]); saveToHistory([]) }} className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-sm font-medium">
                Clear Canvas
              </button>
              <button id="export-btn" onClick={exportToPNG} className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary hover:text-black text-sm font-medium flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export PNG
              </button>
            </div>
          </div>

          {/* Tutorials, Learning Path, Projects */}
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Design Tutorials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {tutorials.map((t) => {
                const Icon = t.icon
                return (
                  <a key={t.title} href={t.link} target="_blank" rel="noopener noreferrer" className="group p-4 sm:p-6 rounded-3xl bg-card border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all hover:scale-105">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{t.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{t.description}</p>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-bold">Start <ExternalLink className="h-3.5 w-3.5" /></div>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="mb-12 p-5 sm:p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Learning Path</h2>
            <div className="space-y-2">
              {lessons.map((l, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/50 border border-primary/20 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{i + 1}</div>
                  <span className="text-white text-sm">{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-5">Example Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((p) => (
                <div key={p.title} className="group rounded-2xl overflow-hidden bg-black/50 border border-primary/20">
                  <div className="aspect-video overflow-hidden">
                    <img src={p.image || "/placeholder.svg"} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base font-bold text-white mb-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{p.description}</p>
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