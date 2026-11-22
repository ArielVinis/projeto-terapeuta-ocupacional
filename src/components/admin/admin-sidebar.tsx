"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpenIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptIcon,
  StoreIcon,
} from "lucide-react"
import { PATHS } from "@/src/constants/paths"
import { authClient } from "@/src/server/auth/client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/src/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: PATHS.admin.root,
    icon: LayoutDashboardIcon,
  },
  {
    title: "E-books",
    href: PATHS.admin.ebooks,
    icon: BookOpenIcon,
  },
  {
    title: "Vendas",
    href: PATHS.admin.sales,
    icon: ReceiptIcon,
  },
  {
    title: "Loja",
    href: PATHS.shop,
    icon: StoreIcon,
  },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push(PATHS.login)
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={PATHS.admin.root} />}
              tooltip="Admin"
            >
              <span className="font-serif text-base font-semibold truncate">
                Admin
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === PATHS.admin.root
                    ? pathname === PATHS.admin.root
                    : pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href={PATHS.home} />}
              tooltip="Voltar ao site"
            >
              <HomeIcon />
              <span>Voltar ao site</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={() => {
                void handleLogout()
              }}
            >
              <LogOutIcon />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
