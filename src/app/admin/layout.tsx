import { PATHS } from "@/src/constants/paths"
import { AdminSidebar } from "@/src/components/admin/admin-sidebar"
import { Separator } from "@/src/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar"
import { TooltipProvider } from "@/src/components/ui/tooltip"
import { requireAdmin } from "@/src/server/auth/session"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin(PATHS.admin.root)

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium text-muted-foreground">
              Painel
            </span>
          </header>
          <div className="flex flex-1 flex-col gap-8 p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
