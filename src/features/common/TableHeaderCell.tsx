import React from 'react'

export default function TableHeaderCell({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <th className="text-left py-2 whitespace-nowrap text-[#B3B3B3] font-medium">
      <span className="inline-flex items-center gap-1">{icon}{children}</span>
    </th>
  )
}

