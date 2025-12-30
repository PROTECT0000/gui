import React from 'react'

interface SectionProps {
  title: React.ReactNode
  children: React.ReactNode
  action?: React.ReactNode
  fill?: boolean
  className?: string
  bodyClassName?: string
}

export default function Section({ title, children, action, fill = false, className = '', bodyClassName = '' }: SectionProps) {
  return (
    <section className={(fill ? 'h-full flex flex-col ' : '') + `border border-[#2A2A2A] rounded-[8px] p-4 bg-black ${className}`.trim()}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">{title}</h2>
        {action}
      </div>
      <div className={(fill ? 'flex-1 min-h-0 ' : '') + bodyClassName}>{children}</div>
    </section>
  )
}

