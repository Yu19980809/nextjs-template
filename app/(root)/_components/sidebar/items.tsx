'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee, LayoutList } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Hint } from '@/components/hint'


export const Items = () => {
  const pathname = usePathname()
  const {collapsed} = useSidebar()

  const routes = [
    {
      label: 'Product',
      href: '/product',
      icon: Coffee
    },
    {
      label: 'Category',
      href: '/category',
      icon: LayoutList
    }
  ]

  return (
    <ul className="space-y-2 px-2">
      {routes.map(route => (
        <Button
          asChild
          key={route.href}
          variant="ghost"
          className={cn(
            'w-full h-12',
            collapsed ? 'justify-center ' : 'justify-start',
            pathname === route.href && 'bg-accent'
          )}
        >
          <Link href={route.href}>
            <div className={cn(
              'flex items-center w-full gap-x-4',
              collapsed && 'justify-center'
            )}>
              {collapsed && (
                <Hint label={route.label} side="right" asChild>
                  <route.icon className="w-4 h-4" />
                </Hint>
              )}

              {!collapsed && (
                <>
                  <route.icon className="w-4 h-4" />

                  <p className="truncate">
                    {route.label}
                  </p>
                </>
              )}
            </div>
          </Link>
        </Button>
      ))}
    </ul>
  )
}

export const ItemsSkeleton = () => (
  <li className="flex items-center gap-x-4 px-3 py-2">
    <Skeleton className="min-w-[32px] min-h-[32px] rounded-full" />

    <div className="flex-1">
      <Skeleton className="h-6" />
    </div>
  </li>
)
