import { Toggle, ToggleSkeleton } from './toggle'
import Wrapper from './wrapper'
import { Items, ItemsSkeleton } from './items'

export const Sidebar = () => {

  return (
    <Wrapper>
      <Toggle />
      <Items />
    </Wrapper>
  )
}

export const SidebarSkeleton = () => (
  <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full border-r border-[#2D2E35] bg-background z-50">
    <ToggleSkeleton />

    {[...Array(3)].map((_, i) => (
      <ItemsSkeleton key={i} />
    ))}
  </aside>
)
