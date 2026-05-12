import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'
import type { NavPrimaryProps } from '#/lib/types'
import { Link } from '@tanstack/react-router'

export function NavPrimary({ items }: NavPrimaryProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, idx) => {
            return (
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton asChild size={'sm'}>
                  <Link
                    activeProps={{ 'data-active': true }}
                    to={item.to}
                    activeOptions={item.activeOptions}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
