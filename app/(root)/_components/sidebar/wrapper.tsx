'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { useIsClient } from 'usehooks-ts'
import { ToggleSkeleton } from './toggle'
import { ItemsSkeleton } from './items'

const Wrapper = ({
  children
}: {
  children: React.ReactNode
}) => {
  const isClient = useIsClient()
  const {collapsed} = useSidebar()

  if (!isClient) {
    return (
      <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full border-r border-[#2D2E35] bg-background z-50">
        <ToggleSkeleton />

        {[...Array(3)].map((_, i) => (
          <ItemsSkeleton key={i} />
        ))}
      </aside>
    )
  }

  return (
    <aside className={cn(
      'fixed left-0 flex flex-col w-60 h-full border-r border-[#2D2E35] bg-background z-50',
      collapsed && 'w-[70px]'
    )}>
      {children}
    </aside>
  )
}

export default Wrapper
