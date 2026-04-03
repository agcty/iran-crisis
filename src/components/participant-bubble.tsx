import type { CSSProperties } from "react";
import { STATUS_META, type Participant } from "../data/participant-data";

interface ParticipantBubbleProps {
  participant: Participant;
  size?: number;
  showName?: boolean;
  showStatus?: boolean;
  isHovered?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  style?: CSSProperties;
}

export default function ParticipantBubble({
  participant,
  size = 64,
  showName = false,
  showStatus = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
  style,
}: ParticipantBubbleProps) {
  const meta = STATUS_META[participant.status];

  return (
    <div
      className={`flex flex-col items-center gap-2 cursor-pointer ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      {/* Avatar with status ring */}
      <div
        className="rounded-full overflow-hidden transition-all duration-300"
        style={{
          width: size,
          height: size,
          border: `2.5px solid ${meta.color}${isHovered ? '50' : '28'}`,
          boxShadow: isHovered
            ? `0 8px 24px -4px rgba(0,0,0,0.12), 0 0 0 3px ${meta.color}15`
            : `0 2px 8px -2px rgba(0,0,0,0.06)`,
          transform: isHovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        <img
          src={participant.avatar}
          alt={participant.name}
          className="size-full object-cover"
          draggable={false}
        />
      </div>

      {showName && (
        <span
          className="text-[14px] font-[520] tracking-[-0.01em] text-center leading-[1.25]"
          style={{
            color: isHovered ? "#2C2A27" : "#5A5650",
            fontFamily: "'Satoshi', sans-serif",
            maxWidth: size + 36,
            transition: "color 0.2s",
          }}
        >
          {participant.name}
        </span>
      )}

      {showStatus && (
        <span
          className="inline-flex items-center gap-[4px] text-[11px] font-[500] py-[3px] px-[8px] rounded-full whitespace-nowrap"
          style={{
            background: meta.bg,
            color: meta.color,
            fontFamily: "'Satoshi', sans-serif",
          }}
        >
          <span
            className="size-[4px] rounded-full"
            style={{ background: meta.color }}
          />
          {participant.status}
        </span>
      )}
    </div>
  );
}
