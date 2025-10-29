import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  ArrowLeft,
  Power,
  Youtube,
  Zap,
  Info,
  Trash2,
  Save,
  Download,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import Navbar from "@/components/Utils/Navbar"
import Footer from "@/components/Utils/Footer"
import ComponentVisual from "@/components/Utils/ComponentVisual"

type ComponentType =
  | "battery"
  | "led"
  | "resistor"
  | "switch"
  | "buzzer"
  | "ldr"
  | "thermistor"
  | "fan"
  | "breadboard"
  | "wire"

type Component = {
  id: string
  type: ComponentType
  x: number
  y: number
  connections: string[]
  rotation?: number
  scale?: number
}

type Wire = {
  id: string
  from: string
  to: string
}

const prebuiltCircuits = [
  {
    name: "LED Circuit",
    description: "LED + resistor + battery",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 100, y: 200, connections: ["led1"], rotation: 0 },
      {
        id: "resistor1",
        type: "resistor" as ComponentType,
        x: 250,
        y: 200,
        connections: ["battery1", "led1"],
        rotation: 0,
      },
      { id: "led1", type: "led" as ComponentType, x: 400, y: 200, connections: ["resistor1"], rotation: 0 },
    ],
  },
  {
    name: "Series Circuit",
    description: "Two LEDs in series",
    youtubeUrl: "https://youtube.com/watch?v=example2",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 80, y: 200, connections: ["led1"], rotation: 0 },
      { id: "led1", type: "led" as ComponentType, x: 200, y: 200, connections: ["led2"], rotation: 0 },
      { id: "led2", type: "led" as ComponentType, x: 320, y: 200, connections: ["resistor1"], rotation: 0 },
      { id: "resistor1", type: "resistor" as ComponentType, x: 440, y: 200, connections: ["battery1"], rotation: 0 },
    ],
  },
  {
    name: "Switch-Controlled LED",
    description: "LED with on/off switch",
    youtubeUrl: "https://youtube.com/watch?v=example4",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 80, y: 200, connections: ["switch1"], rotation: 0 },
      { id: "switch1", type: "switch" as ComponentType, x: 200, y: 200, connections: ["led1"], rotation: 0 },
      { id: "led1", type: "led" as ComponentType, x: 320, y: 200, connections: ["resistor1"], rotation: 0 },
      { id: "resistor1", type: "resistor" as ComponentType, x: 440, y: 200, connections: ["battery1"], rotation: 0 },
    ],
  },
  {
    name: "Buzzer Circuit",
    description: "Simple buzzer alarm",
    youtubeUrl: "https://youtube.com/watch?v=example5",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 150, y: 200, connections: ["switch1"], rotation: 0 },
      { id: "switch1", type: "switch" as ComponentType, x: 280, y: 200, connections: ["buzzer1"], rotation: 0 },
      { id: "buzzer1", type: "buzzer" as ComponentType, x: 410, y: 200, connections: ["battery1"], rotation: 0 },
    ],
  },
  {
    name: "LDR Circuit",
    description: "Light-dependent resistor",
    youtubeUrl: "https://youtube.com/watch?v=example6",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 150, y: 200, connections: ["ldr1"], rotation: 0 },
      { id: "ldr1", type: "ldr" as ComponentType, x: 280, y: 200, connections: ["led1"], rotation: 0 },
      { id: "led1", type: "led" as ComponentType, x: 410, y: 200, connections: ["battery1"], rotation: 0 },
    ],
  },
  {
    name: "Temperature Sensor",
    description: "Thermistor-based sensor",
    youtubeUrl: "https://youtube.com/watch?v=example7",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 150, y: 200, connections: ["thermistor1"], rotation: 0 },
      { id: "thermistor1", type: "thermistor" as ComponentType, x: 280, y: 200, connections: ["led1"], rotation: 0 },
      { id: "led1", type: "led" as ComponentType, x: 410, y: 200, connections: ["battery1"], rotation: 0 },
    ],
  },
  {
    name: "Simple Fan Circuit",
    description: "Motor-driven fan",
    youtubeUrl: "https://youtube.com/watch?v=example8",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 150, y: 200, connections: ["switch1"], rotation: 0 },
      { id: "switch1", type: "switch" as ComponentType, x: 280, y: 200, connections: ["fan1"], rotation: 0 },
      { id: "fan1", type: "fan" as ComponentType, x: 410, y: 200, connections: ["battery1"], rotation: 0 },
    ],
  },
  {
    name: "Parallel Circuit",
    description: "Two LEDs in parallel",
    youtubeUrl: "https://youtube.com/watch?v=example3",
    components: [
      { id: "battery1", type: "battery" as ComponentType, x: 100, y: 250, connections: ["led1", "led2"], rotation: 0 },
      { id: "led1", type: "led" as ComponentType, x: 300, y: 150, connections: ["battery1"], rotation: 0 },
      { id: "led2", type: "led" as ComponentType, x: 300, y: 350, connections: ["battery1"], rotation: 0 },
    ],
  },
]

const lessons = [
  {
    title: "What is a Circuit?",
    content: "A circuit is a closed loop that allows electricity to flow. Learn about current, voltage, and power.",
  },
  {
    title: "Understanding Voltage & Resistance",
    content: "Ohm's Law (V = I × R) explains the relationship between voltage, current, and resistance.",
  },
  {
    title: "LED Basics",
    content: "LEDs have polarity - they only work one way! Learn why resistors are essential.",
  },
  {
    title: "Build Your First Blinking Circuit",
    content: "Step-by-step guide to creating a simple LED circuit with visuals and explanations.",
  },
]

const componentInfo: Record<ComponentType, { name: string; description: string; tips: string }> = {
  battery: {
    name: "Battery (Power Source)",
    description: "Provides electrical energy to the circuit. Has positive (+) and negative (-) terminals.",
    tips: "Always connect + to - to complete the circuit. Common voltages: 3V, 5V, 9V.",
  },
  led: {
    name: "LED (Light Emitting Diode)",
    description: "A semiconductor that emits light when current flows through it.",
    tips: "LEDs have polarity! Long leg is positive (+). Always use a resistor to prevent burning out.",
  },
  resistor: {
    name: "Resistor",
    description: "Limits the flow of electric current to protect components.",
    tips: "Color bands indicate resistance value. Essential for protecting LEDs from too much current.",
  },
  switch: {
    name: "Switch / Push Button",
    description: "Opens or closes the circuit to control current flow.",
    tips: "When closed, current flows. When open, circuit is broken and components turn off.",
  },
  buzzer: {
    name: "Buzzer",
    description: "Converts electrical energy into sound.",
    tips: "Makes a buzzing sound when powered. Great for alarms and notifications.",
  },
  ldr: {
    name: "LDR (Light Dependent Resistor)",
    description: "Resistance changes based on light levels.",
    tips: "In bright light: low resistance. In darkness: high resistance. Perfect for automatic lights.",
  },
  thermistor: {
    name: "Thermistor (Temperature Sensor)",
    description: "Resistance changes with temperature.",
    tips: "Gets hot: resistance changes. Use to detect temperature and trigger other components.",
  },
  fan: {
    name: "Fan / Motor",
    description: "Converts electrical energy into mechanical motion.",
    tips: "Spins when powered. Can be used for cooling or creating movement in projects.",
  },
  breadboard: {
    name: "Breadboard",
    description: "A platform for building circuits without soldering.",
    tips: "Holes are connected in rows. Use to prototype circuits quickly and safely.",
  },
  wire: {
    name: "Wire",
    description: "Conducts electricity between components in the circuit.",
    tips: "Ensure proper connections. Avoid crossing wires unnecessarily to prevent short circuits.",
  },
}

export default function Electronics() {
  const [components, setComponents] = useState<Component[]>([])
  const [wires, setWires] = useState<Wire[]>([])
  const [isPowerOn, setIsPowerOn] = useState(false)
  const [voltage] = useState(9)
  const [, setSelectedCircuit] = useState<string | null>(null)
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | null>(null)
  const [circuitWarning, setCircuitWarning] = useState<string | null>(null)
  const [savedCircuits, setSavedCircuits] = useState<
    { name: string; data: { components: Component[]; wires: Wire[] } }[]
  >([])
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"components" | "info">("components")
  const canvasRef = useRef<HTMLDivElement>(null)

  // Dragging state
  const [isDragging, setIsDragging] = useState(false)
  const [currentDragId, setCurrentDragId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Track canvas size
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 500 })

  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        })
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Global pointer move/up for dragging
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !currentDragId || !canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - dragOffset.x
      const y = e.clientY - rect.top - dragOffset.y

      setComponents((prev) =>
        prev.map((c) =>
          c.id === currentDragId
            ? { ...c, x: Math.max(0, Math.min(rect.width - 60, x)), y: Math.max(0, Math.min(rect.height - 60, y)) }
            : c
        )
      )
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      setCurrentDragId(null)
    }

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
      window.addEventListener("pointercancel", handlePointerUp)
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [isDragging, currentDragId, dragOffset])

  const handlePointerDown = (e: React.PointerEvent, component: Component) => {
    // Ignore right-click
    if (e.pointerType === "mouse" && e.button !== 0) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const clientX = e.clientX
    const clientY = e.clientY

    setIsDragging(true)
    setCurrentDragId(component.id)
    setDragOffset({
      x: clientX - rect.left - component.x,
      y: clientY - rect.top - component.y,
    })

    // Capture pointer
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const loadCircuit = (circuit: (typeof prebuiltCircuits)[0]) => {
    setComponents(circuit.components)
    setSelectedCircuit(circuit.name)
    setIsPowerOn(false)
    const newWires: Wire[] = []
    circuit.components.forEach((comp) => {
      comp.connections.forEach((targetId) => {
        if (
          !newWires.find((w) => (w.from === comp.id && w.to === targetId) || (w.from === targetId && w.to === comp.id))
        ) {
          newWires.push({ id: `wire-${comp.id}-${targetId}`, from: comp.id, to: targetId })
        }
      })
    })
    setWires(newWires)
  }

  const addComponentToCanvas = (type: ComponentType) => {
    const centerX = canvasSize.width / 2 - 30
    const centerY = canvasSize.height / 2 - 30

    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      x: centerX,
      y: centerY,
      connections: [],
      rotation: 0,
      scale: 1,
    }
    setComponents([...components, newComponent])
  }

  const removeComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id))
    setWires((prev) => prev.filter((w) => w.from !== id && w.to !== id))
  }

  const validateCircuit = () => {
    const hasBattery = components.some((c) => c.type === "battery")
    const hasLoad = components.some((c) => ["led", "buzzer", "fan"].includes(c.type))

    if (!hasBattery) {
      setCircuitWarning("No power source! Add a battery to your circuit.")
      return false
    }
    if (!hasLoad) {
      setCircuitWarning("No output component! Add an LED, buzzer, or fan.")
      return false
    }
    if (wires.length === 0) {
      setCircuitWarning("Components not connected! Connect them with wires.")
      return false
    }

    setCircuitWarning(null)
    return true
  }

  const saveCircuit = () => {
    const name = prompt("Enter a name for this circuit:")
    if (name) {
      setSavedCircuits([...savedCircuits, { name, data: { components, wires } }])
      alert(`Circuit "${name}" saved!`)
    }
  }

  const loadSavedCircuit = (circuit: { name: string; data: { components: Component[]; wires: Wire[] } }) => {
    setComponents(circuit.data.components)
    setWires(circuit.data.wires)
    setIsPowerOn(false)
    setSelectedCircuit(circuit.name)
  }

  const simulate = () => {
    if (!isPowerOn) {
      validateCircuit()
    }
    setIsPowerOn(!isPowerOn)
  }

  const resizeComponent = (id: string, delta: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, scale: Math.max(0.5, Math.min(2, (c.scale || 1) + delta)) } : c))
    )
  }

  const handleComponentClick = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (connectingFrom === null) {
      setConnectingFrom(componentId)
    } else if (connectingFrom === componentId) {
      setConnectingFrom(null)
    } else {
      const wireId = `wire-${connectingFrom}-${componentId}`
      const reverseWireId = `wire-${componentId}-${connectingFrom}`

      const wireExists = wires.some((w) => w.id === wireId || w.id === reverseWireId)

      if (!wireExists) {
        const newWire: Wire = {
          id: wireId,
          from: connectingFrom,
          to: componentId,
        }
        setWires([...wires, newWire])

        setComponents((prev) =>
          prev.map((c) => {
            if (c.id === connectingFrom) {
              return { ...c, connections: [...c.connections, componentId] }
            }
            if (c.id === componentId) {
              return { ...c, connections: [...c.connections, connectingFrom] }
            }
            return c
          })
        )
      }

      setConnectingFrom(null)
    }
  }

  const handleWireClick = (wireId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const wire = wires.find((w) => w.id === wireId)
    if (!wire) return

    setWires((prev) => prev.filter((w) => w.id !== wireId))

    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === wire.from) {
          return { ...c, connections: c.connections.filter((id) => id !== wire.to) }
        }
        if (c.id === wire.to) {
          return { ...c, connections: c.connections.filter((id) => id !== wire.from) }
        }
        return c
      })
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">

          {/* Back Button */}
          <a
            href="/digitalhub"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 text-sm sm:text-base transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            Back to Digital Hub
          </a>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Electronics & <span className="text-primary">Hardware Lab</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-3xl">
            Build and simulate circuits with visual, interactive components
          </p>

          {/* Mobile Tabs */}
          <div className="lg:hidden flex border-b border-primary/20 mb-6">
            <button
              onClick={() => setActiveTab("components")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "components"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              }`}
            >
              Info
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">

            {/* Left: Components */}
            <div className={`${activeTab === "components" ? "block" : "hidden lg:block"} lg:col-span-3`}>
              <div className="p-4 sm:p-6 rounded-3xl bg-card border-2 border-primary/30 sticky top-20 lg:top-24 max-h-[70vh] lg:max-h-none overflow-y-auto">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Components
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {(
                    [
                      "battery",
                      "led",
                      "resistor",
                      "switch",
                      "buzzer",
                      "ldr",
                      "thermistor",
                      "fan",
                      "breadboard",
                      "wire",
                    ] as ComponentType[]
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => addComponentToCanvas(type)}
                      onMouseEnter={() => setSelectedComponent(type)}
                      onMouseLeave={() => setSelectedComponent(null)}
                      className="p-3 rounded-xl bg-black/50 hover:bg-primary/10 border border-primary/20 hover:border-primary/50 transition-all flex items-center gap-2 sm:gap-3 group text-left"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                        <ComponentVisual componentType={type} isPowered={false} />
                      </div>
                      <span className="text-xs sm:text-sm text-white font-medium capitalize truncate">
                        {type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center: Canvas */}
            <div className="lg:col-span-6">
              <div className="p-4 sm:p-6 rounded-3xl bg-card border-2 border-primary/30">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Circuit Workspace</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={simulate}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                        isPowerOn
                          ? "bg-primary text-black"
                          : "bg-black/50 border border-primary/30 text-primary hover:bg-primary/10"
                      }`}
                    >
                      <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {isPowerOn ? "Stop" : "Simulate"}
                    </button>
                    <button
                      onClick={saveCircuit}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
                    >
                      <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setComponents([])
                        setWires([])
                        setIsPowerOn(false)
                        setCircuitWarning(null)
                        setConnectingFrom(null)
                      }}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Reset
                    </button>
                  </div>
                </div>

                {connectingFrom && (
                  <div className="mb-3 p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center gap-2 text-blue-400 text-xs sm:text-sm">
                    <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Click another component to connect
                  </div>
                )}

                {circuitWarning && (
                  <div className="mb-3 p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2 text-yellow-400 text-xs sm:text-sm">
                    <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {circuitWarning}
                  </div>
                )}

                {/* Canvas */}
                <div
                  ref={canvasRef}
                  className="bg-black/50 rounded-2xl p-3 sm:p-4 min-h-80 sm:min-h-96 lg:min-h-[500px] border-2 border-primary/20 relative overflow-hidden"
                  style={{
                    backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {wires.map((wire) => {
                      const fromComp = components.find((c) => c.id === wire.from)
                      const toComp = components.find((c) => c.id === wire.to)
                      if (!fromComp || !toComp) return null
                      return (
                        <g key={wire.id}>
                          <line
                            x1={fromComp.x + 30}
                            y1={fromComp.y + 30}
                            x2={toComp.x + 30}
                            y2={toComp.y + 30}
                            stroke="transparent"
                            strokeWidth="12"
                            className="pointer-events-auto cursor-pointer"
                            onClick={(e) => handleWireClick(wire.id, e)}
                          />
                          <line
                            x1={fromComp.x + 30}
                            y1={fromComp.y + 30}
                            x2={toComp.x + 30}
                            y2={toComp.y + 30}
                            stroke={isPowerOn ? "#FFC5D3" : "#666"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            className={`pointer-events-none ${isPowerOn ? "animate-pulse" : ""}`}
                          />
                        </g>
                      )
                    })}
                  </svg>

                  {components.map((component) => (
                    <div
                      key={component.id}
                      onPointerDown={(e) => handlePointerDown(e, component)}
                      onClick={(e) => {
                        if (isDragging) {
                          e.stopPropagation()
                          return
                        }
                        handleComponentClick(component.id, e)
                      }}
                      className={`absolute cursor-move select-none touch-none transition-transform group ${
                        connectingFrom === component.id ? "ring-4 ring-blue-400 rounded-full" : ""
                      } ${isDragging && currentDragId === component.id ? "z-50 scale-110 shadow-2xl" : ""}`}
                      style={{
                        left: component.x,
                        top: component.y,
                        transform: `scale(${component.scale || 1})`,
                        touchAction: "none",
                      }}
                    >
                      <ComponentVisual
                        componentType={component.type}
                        isPowered={isPowerOn}
                        rotation={component.rotation}
                        scale={component.scale || 1}
                      />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            resizeComponent(component.id, -0.1)
                          }}
                          className="w-6 h-6 rounded bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all text-xs"
                        >
                          -
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            resizeComponent(component.id, 0.1)
                          }}
                          className="w-6 h-6 rounded bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all text-xs"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeComponent(component.id)
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {components.length === 0 && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center px-4">
                      <div>
                        <Zap className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 text-primary/50" />
                        <p className="text-sm sm:text-base">Click components to add them</p>
                        <p className="text-xs sm:text-sm mt-1">Drag to move • Click X to remove</p>
                        <p className="text-xs sm:text-sm mt-1">Click to connect with wires</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-black/50 border border-primary/20 text-center">
                    <p className="text-xs text-muted-foreground">Voltage</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{voltage}V</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-black/50 border border-primary/20 text-center">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{isPowerOn ? "ON" : "OFF"}</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-xl bg-black/50 border border-primary/20 text-center">
                    <p className="text-xs text-muted-foreground">Parts</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{components.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div className={`${activeTab === "info" ? "block" : "hidden lg:block"} lg:col-span-3`}>
              <div className="p-4 sm:p-6 rounded-3xl bg-card border-2 border-primary/30 sticky top-20 lg:top-24">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Component Info
                </h3>
                {selectedComponent ? (
                  <div className="space-y-4">
                    <div className="flex justify-center p-3 sm:p-4 bg-black/50 rounded-xl">
                      <ComponentVisual componentType={selectedComponent} isPowered={false} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2 text-sm sm:text-base">{componentInfo[selectedComponent].name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                        {componentInfo[selectedComponent].description}
                      </p>
                      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-xs text-primary font-medium mb-1">Tips:</p>
                        <p className="text-xs text-muted-foreground">{componentInfo[selectedComponent].tips}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground">Hover over a component to see details</p>
                )}

                <div className="mt-6 pt-6 border-t border-primary/20">
                  <h4 className="font-bold text-white mb-3 text-sm">Circuit Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      {components.some((c) => c.type === "battery") ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span
                        className={
                          components.some((c) => c.type === "battery") ? "text-green-400" : "text-muted-foreground"
                        }
                      >
                        Power source added
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {components.some((c) => ["led", "buzzer", "fan"].includes(c.type)) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span
                        className={
                          components.some((c) => ["led", "buzzer", "fan"].includes(c.type))
                            ? "text-green-400"
                            : "text-muted-foreground"
                        }
                      >
                        Output component added
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {wires.length > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                      <span className={wires.length > 0 ? "text-green-400" : "text-muted-foreground"}>
                        Components connected
                      </span>
                    </div>
                  </div>
                </div>

                {savedCircuits.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <h4 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" />
                      Saved Circuits
                    </h4>
                    <div className="space-y-2">
                      {savedCircuits.map((circuit, index) => (
                        <button
                          key={index}
                          onClick={() => loadSavedCircuit(circuit)}
                          className="w-full p-2 rounded-lg bg-black/50 hover:bg-primary/10 border border-primary/20 hover:border-primary/50 transition-all text-left text-xs text-white"
                        >
                          {circuit.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pre-built Circuits */}
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Pre-built Circuits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {prebuiltCircuits.map((circuit) => (
                <div
                  key={circuit.name}
                  className="p-4 rounded-2xl bg-black/50 border border-primary/20 hover:border-primary/50 transition-all"
                >
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{circuit.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">{circuit.description}</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={circuit.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-xs sm:text-sm"
                    >
                      <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Tutorial
                    </a>
                    <button
                      onClick={() => loadCircuit(circuit)}
                      className="px-3 py-1.5 rounded-xl bg-primary/20 text-primary hover:bg-primary hover:text-black transition-all text-xs sm:text-sm"
                    >
                      Try It
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Path */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border-2 border-primary/30">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Learning Path</h2>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div key={index} className="rounded-xl bg-black/50 border border-primary/20 overflow-hidden">
                  <button
                    onClick={() => setExpandedLesson(expandedLesson === index ? null : index)}
                    className="w-full p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
                      {index + 1}
                    </div>
                    <span className="text-sm sm:text-base text-white font-medium flex-1">{lesson.title}</span>
                    <Zap className={`h-4 w-4 sm:h-5 sm:w-5 text-primary transition-transform ${expandedLesson === index ? "rotate-180" : ""}`} />
                  </button>
                  {expandedLesson === index && (
                    <div className="p-3 sm:p-4 pt-0 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {lesson.content}
                    </div>
                  )}
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