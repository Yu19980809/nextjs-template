'use client'

import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'

import { useSidebar } from '@/store/use-sidebar'
import { Hint } from '@/components/hint'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const Toggle = () => {
  const {collapsed, onExpand, onCollapse} = useSidebar()
  const label = collapsed ? 'Expand' : 'Collapse'

  return (
    <>
      {collapsed && (
        <div className="hidden lg:flex justify-center items-center w-full mb-4 pt-4">
          <Hint label={label} side="right" asChild>
            <Button
              onClick={onExpand}
              variant="ghost"
              className="h-auto p-2"
            >
              <ArrowRightFromLine className="w-4 h-4" />
            </Button>
          </Hint>
        </div>
      )}

      {!collapsed && (
        <div className="flex items-center w-full p-3 pl-6 mb-2">
          <p className="font-semibold text-primary">
            For you
          </p>

          <Hint label={label} side="right" asChild>
            <Button
              onClick={onCollapse}
              variant="ghost"
              className="h-auto ml-auto p-2"
            >
              <ArrowLeftFromLine className="w-4 h-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  )
}

export const ToggleSkeleton = () => (
  <div className="hidden lg:flex justify-center items-center w-full mb-2 p-3 pl-6">
    <Skeleton className="w-[100px] h-6" />
    <Skeleton className="w-6 h-6" />
  </div>
)
