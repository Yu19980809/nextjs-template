'use client'

import { useMediaQuery } from 'usehooks-ts'
import { useEffect } from 'react'

import { useSidebar } from '@/store/use-sidebar'
import { cn } from '@/lib/utils'

const Container = ({
  children
}: {
  children: React.ReactNode
}) => {
  const matches = useMediaQuery('(max-width: 1024px)')
  const {collapsed, onExpand, onCollapse} = useSidebar()

  useEffect(() => {
    if (matches) {
      onCollapse()
    } else {
      onExpand()
    }
  }, [matches, onExpand, onCollapse])

  return (
    <div className={cn(
      'flex-1',
      collapsed ? 'ml-[70px]' : 'ml-[70px] lg:ml-60'
    )}>
      {children}
    </div>
  )
}

export default Container