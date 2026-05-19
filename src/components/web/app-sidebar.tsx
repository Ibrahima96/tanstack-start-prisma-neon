import { BookmarkIcon, Compass, Import } from 'lucide-react'
import { NavPrimary } from '#/components/web/nav-primary'
import { NavUser } from '#/components/web/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/components/ui/sidebar.tsx'
import { Link, linkOptions } from '@tanstack/react-router'
import type { NavPrimaryProps, NavUserProps } from '#/lib/types'

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: 'Items',
    icon: BookmarkIcon,
    to: '/dashboard/items',
    activeOptions: { exact: false },
  },
  {
    title: 'Import',
    icon: Import,
    to: '/dashboard/import',
    activeOptions: { exact: false },
  },
  {
    title: 'Discover',
    icon: Compass,
    to: '/dashboard/discover',
    activeOptions: { exact: false },
  },
])

export function AppSidebar({ user }: NavUserProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size={'lg'} asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 rounded-lg">
                  <BookmarkIcon className="size-4" />
                </div>
                <div className="flex-1 grid text-left text-sm leading-tight">
                  <span className="font-medium">Recall</span>
                  <span className="text-xs">Your Ai knowledge Base</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
