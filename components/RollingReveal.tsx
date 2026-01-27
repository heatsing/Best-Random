"use client"

import { useEffect, useState, ReactNode } from "react"
import * as React from "react"
import { cn } from "@/lib/utils"

interface RollingRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  staggerDelay?: number
}

export function RollingReveal({ 
  children, 
  delay = 0,
  className,
  staggerDelay = 60
}: RollingRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    if (typeof window === 'undefined') return
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    // Use addEventListener if available, otherwise fallback
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange)
        }
      }
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
      return () => {
        if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleChange)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Skip animation delay if user prefers reduced motion
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, prefersReducedMotion ? 0 : delay)
    return () => clearTimeout(timer)
  }, [delay, prefersReducedMotion])

  return (
    <div
      className={cn(
        prefersReducedMotion 
          ? "opacity-100" 
          : "transition-opacity transition-transform duration-300",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  )
}

interface StaggeredListProps {
  children: ReactNode[]
  className?: string
  itemClassName?: string
  staggerDelay?: number
}

export function StaggeredList({ 
  children, 
  className,
  itemClassName,
  staggerDelay = 60
}: StaggeredListProps) {
  // Convert children to array and ensure stable keys
  const childrenArray = React.Children.toArray(children)
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <RollingReveal
          key={`staggered-${index}-${React.isValidElement(child) && child.key ? child.key : index}`}
          delay={index * staggerDelay}
          className={itemClassName}
        >
          {child}
        </RollingReveal>
      ))}
    </div>
  )
}
