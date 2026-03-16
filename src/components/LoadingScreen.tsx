import { useEffect, useState } from 'react'

const PHONE_PIXELS = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [0, 1, 1, 1, 0],
]

const BAR_BLOCKS = 12
const PIXEL_SIZE = 8

interface Props {
  isVisible: boolean
}

export function LoadingScreen({ isVisible }: Props) {
  const [filledBlocks, setFilledBlocks] = useState(0)
  const [blinkOn, setBlinkOn] = useState(true)

  useEffect(() => {
    if (!isVisible) return
    setFilledBlocks(0)

    const interval = setInterval(() => {
      setFilledBlocks(prev => (prev >= BAR_BLOCKS ? BAR_BLOCKS : prev + 1))
    }, 100)

    const blink = setInterval(() => {
      setBlinkOn(prev => !prev)
    }, 530)

    return () => {
      clearInterval(interval)
      clearInterval(blink)
    }
  }, [isVisible])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#12121a]"
      style={{
        transition: 'opacity 0.7s ease',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'all' : 'none',
      }}
    >
      <div className="flex flex-col items-center gap-10">
        {/* Pixel art phone */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(5, ${PIXEL_SIZE}px)`,
            gridTemplateRows: `repeat(9, ${PIXEL_SIZE}px)`,
            gap: 2,
          }}
        >
          {PHONE_PIXELS.flatMap((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                style={{
                  width: PIXEL_SIZE,
                  height: PIXEL_SIZE,
                  backgroundColor: cell
                    ? r === 2 && c === 2
                      ? blinkOn
                        ? '#34d399'
                        : '#059669'
                      : '#10b981'
                    : 'transparent',
                  imageRendering: 'pixelated',
                }}
              />
            ))
          )}
        </div>

        {/* Loading bar */}
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: BAR_BLOCKS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 20,
                imageRendering: 'pixelated',
                backgroundColor: i < filledBlocks ? '#10b981' : '#052e16',
                transition: 'background-color 0.08s',
              }}
            />
          ))}
        </div>

        {/* Text */}
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: 11,
            letterSpacing: '0.35em',
            color: '#10b981',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          {blinkOn ? 'LOADING_' : 'LOADING\u00a0'}
        </p>
      </div>
    </div>
  )
}
