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

interface ComponentVisualProps {
  componentType: ComponentType
  isPowered: boolean
  rotation?: number
  scale?: number
}

export default function ComponentVisual({ componentType, isPowered, scale = 1 }: ComponentVisualProps) {
  const baseClass = "transition-all duration-300"
  const width = 60 * scale
  const height = 60 * scale

  switch (componentType) {
    case "battery":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <rect
            x="15"
            y="10"
            width="30"
            height="40"
            rx="4"
            fill={isPowered ? "#FFC5D3" : "#333"}
            stroke="#FFC5D3"
            strokeWidth="2"
          />
          <rect x="25" y="5" width="10" height="5" fill="#FFC5D3" />
          <text x="30" y="28" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
            +
          </text>
          <text x="30" y="45" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
            -
          </text>
          <circle cx="30" cy="8" r="3" fill={isPowered ? "#ff0" : "#666"} />
          <circle cx="30" cy="52" r="3" fill="#666" />
        </svg>
      )
    case "led":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <circle cx="30" cy="30" r="15" fill={isPowered ? "#ff0" : "#333"} stroke="#FFC5D3" strokeWidth="2" />
          {isPowered && (
            <>
              <circle cx="30" cy="30" r="15" fill="#ff0" opacity="0.6" className="animate-pulse" />
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="none"
                stroke="#ff0"
                strokeWidth="2"
                opacity="0.4"
                className="animate-ping"
              />
            </>
          )}
          <line x1="30" y1="10" x2="30" y2="5" stroke="#FFC5D3" strokeWidth="2" />
          <line x1="30" y1="50" x2="30" y2="55" stroke="#666" strokeWidth="2" />
          <text x="30" y="35" textAnchor="middle" fill={isPowered ? "#000" : "#FFC5D3"} fontSize="10" fontWeight="bold">
            LED
          </text>
        </svg>
      )
    case "resistor":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <rect x="20" y="25" width="20" height="10" fill="#8B4513" stroke="#FFC5D3" strokeWidth="1" />
          <rect x="22" y="25" width="3" height="10" fill="#ff0" />
          <rect x="27" y="25" width="3" height="10" fill="#000" />
          <rect x="32" y="25" width="3" height="10" fill="#f00" />
          <line x1="10" y1="30" x2="20" y2="30" stroke="#FFC5D3" strokeWidth="2" />
          <line x1="40" y1="30" x2="50" y2="30" stroke="#FFC5D3" strokeWidth="2" />
          <circle cx="10" cy="30" r="2" fill="#FFC5D3" />
          <circle cx="50" cy="30" r="2" fill="#FFC5D3" />
        </svg>
      )
    case "switch":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <circle cx="15" cy="30" r="4" fill="#FFC5D3" />
          <circle cx="45" cy="30" r="4" fill="#FFC5D3" />
          <line
            x1="15"
            y1="30"
            x2={isPowered ? "45" : "35"}
            y2={isPowered ? "30" : "20"}
            stroke="#FFC5D3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="25" y="35" width="10" height="15" rx="2" fill="#333" stroke="#FFC5D3" strokeWidth="1" />
          <text x="30" y="55" textAnchor="middle" fill="#FFC5D3" fontSize="8">
            SWITCH
          </text>
        </svg>
      )
    case "buzzer":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <circle cx="30" cy="30" r="18" fill="#333" stroke="#FFC5D3" strokeWidth="2" />
          {isPowered && (
            <>
              <circle cx="30" cy="30" r="18" fill="#FFC5D3" opacity="0.3" className="animate-pulse" />
              <path d="M 25 25 L 35 30 L 25 35 Z" fill="#ff0" className="animate-bounce" />
            </>
          )}
          <circle cx="30" cy="30" r="8" fill={isPowered ? "#ff0" : "#666"} />
          <line x1="30" y1="10" x2="30" y2="5" stroke="#FFC5D3" strokeWidth="2" />
          <line x1="30" y1="50" x2="30" y2="55" stroke="#666" strokeWidth="2" />
        </svg>
      )
    case "ldr":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <circle cx="30" cy="30" r="15" fill="#8B4513" stroke="#FFC5D3" strokeWidth="2" />
          <path
            d="M 20 15 L 25 20 M 30 12 L 30 18 M 40 15 L 35 20"
            stroke="#ff0"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line x1="30" y1="10" x2="30" y2="5" stroke="#FFC5D3" strokeWidth="2" />
          <line x1="30" y1="50" x2="30" y2="55" stroke="#666" strokeWidth="2" />
          <text x="30" y="35" textAnchor="middle" fill="#FFC5D3" fontSize="8" fontWeight="bold">
            LDR
          </text>
        </svg>
      )
    case "wire":
      return (
        <svg width={width} height={height} viewBox="0 0 60 10" className={baseClass}>
          <line x1="0" y1="5" x2="60" y2="5" stroke="#00f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case "thermistor":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <circle cx="30" cy="30" r="15" fill={isPowered ? "#ff4444" : "#333"} stroke="#FFC5D3" strokeWidth="2" />
          <path
            d="M 30 20 Q 25 25 30 30 Q 35 35 30 40"
            stroke={isPowered ? "#ff0" : "#666"}
            strokeWidth="2"
            fill="none"
          />
          <line x1="30" y1="10" x2="30" y2="5" stroke="#FFC5D3" strokeWidth="2" />
          <line x1="30" y1="50" x2="30" y2="55" stroke="#666" strokeWidth="2" />
          <text x="30" y="52" textAnchor="middle" fill="#FFC5D3" fontSize="7">
            TEMP
          </text>
        </svg>
      )
    case "fan":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <circle cx="30" cy="30" r="18" fill="#333" stroke="#FFC5D3" strokeWidth="2" />
          <g className={isPowered ? "animate-spin origin-center" : ""} style={{ transformOrigin: "30px 30px" }}>
            <ellipse cx="30" cy="18" rx="6" ry="12" fill="#FFC5D3" />
            <ellipse cx="42" cy="30" rx="12" ry="6" fill="#FFC5D3" />
            <ellipse cx="30" cy="42" rx="6" ry="12" fill="#FFC5D3" />
            <ellipse cx="18" cy="30" rx="12" ry="6" fill="#FFC5D3" />
          </g>
          <circle cx="30" cy="30" r="4" fill="#666" />
          <line x1="30" y1="10" x2="30" y2="5" stroke="#FFC5D3" strokeWidth="2" />
          <line x1="30" y1="50" x2="30" y2="55" stroke="#666" strokeWidth="2" />
        </svg>
      )
    case "breadboard":
      return (
        <svg width={width} height={height} viewBox="0 0 60 60" className={baseClass}>
          <rect x="5" y="10" width="50" height="40" rx="4" fill="#1a1a1a" stroke="#FFC5D3" strokeWidth="2" />
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              {[...Array(10)].map((_, j) => (
                <circle key={j} cx={10 + j * 5} cy={15 + i * 8} r="1.5" fill="#666" />
              ))}
            </g>
          ))}
        </svg>
      )
    default:
      return null
  }
}
