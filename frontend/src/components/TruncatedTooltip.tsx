import { Tooltip } from '@mui/material'
import React, { useEffect, useRef, useState, type ReactNode } from 'react'

interface TruncatedTooltipProps {
  title: string
  children: ReactNode
  /** Use for multi-line clamped text (e.g. line-clamp: 2) */
  multiLine?: boolean
}

export function TruncatedTooltip({
  title,
  children,
  multiLine = false,
}: TruncatedTooltipProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const check = () => {
      if (multiLine) {
        setTruncated(el.scrollHeight > el.clientHeight)
      } else {
        setTruncated(el.scrollWidth > el.clientWidth)
      }
    }

    check()
    const resizeObserver = new ResizeObserver(check)
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [title, multiLine])

  if (multiLine) {
    const child = React.Children.only(children) as React.ReactElement<{ ref?: React.Ref<unknown> }>
    return (
      <Tooltip title={truncated ? title : ''}>
        {React.cloneElement(child, { ref })}
      </Tooltip>
    )
  }

  return (
    <Tooltip title={truncated ? title : ''}>
      <span
        ref={ref}
        style={{
          display: 'block',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {children}
      </span>
    </Tooltip>
  )
}
