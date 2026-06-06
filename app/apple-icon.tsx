import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3a5f3a",
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="12" y1="22" x2="12" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M12 14C12 14 8 12 6 8C6 8 10 7 12 10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          <path
            d="M12 11C12 11 16 9 18 5C18 5 14 4 12 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.25)"
          />
          <circle cx="8" cy="22" r="1.2" fill="rgba(255,255,255,0.4)" />
          <circle cx="12" cy="23" r="1.2" fill="rgba(255,255,255,0.4)" />
          <circle cx="16" cy="22" r="1.2" fill="rgba(255,255,255,0.4)" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
