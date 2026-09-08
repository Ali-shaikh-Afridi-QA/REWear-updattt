import React from 'react'
import { Coins } from 'lucide-react'

interface PointsIconProps {
  size?: number
  color?: string
  className?: string
  style?: React.CSSProperties
}

export const PointsIcon: React.FC<PointsIconProps> = ({
  size = 16,
  color = '#203D43',
  className = '',
  style,
}) => {
  return (
    <Coins
      size={size}
      color={color}
      className={className}
      style={{
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style,
      }}
    />
  )
}
