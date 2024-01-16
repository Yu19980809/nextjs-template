import Link from 'next/link'
import { SignInButton, UserButton, currentUser } from '@clerk/nextjs'
import { Clapperboard } from 'lucide-react'

import { Button } from '@/components/ui/button'

const Actions = async () => {
  const user = await currentUser()

  return (
    <div className="flex justify-end items-center gap-x-2 ml-4 lg:ml-0">
      {!user && (
        <SignInButton>
          <Button variant="primary" size="sm">
            Login
          </Button>
        </SignInButton>
      )}

      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <Link href="/dashboard">
              <Clapperboard className="w-5 h-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>

          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  )
}

export default Actions
