
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ImageIcon,
  Image as GalleryIcon,
  Info,
  Briefcase,
  Users,
  MessageSquare,
  Footprints,
  Contact,
  LogOut,
  Settings,
  Search,
  Video,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const menuItems = [
    {
        label: "General",
        items: [
            { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/admin/hero", label: "Hero", icon: ImageIcon },
        ]
    },
    {
        label: "Content",
        items: [
            { href: "/admin/gallery", label: "Gallery", icon: GalleryIcon },
            { href: "/admin/about", label: "About", icon: Info },
            { href: "/admin/services", label: "Services", icon: Briefcase },
            { href: "/admin/portfolio", label: "Portfolio", icon: Users },
            { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
            { href: "/admin/video", label: "Video", icon: Video },
        ]
    },
    {
        label: "Site",
        items: [
            { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
            { href: "/admin/contact", label: "Contact", icon: Contact },
            { href: "/admin/footer", label: "Footer", icon: Footprints },
            { href: "/admin/seo", label: "SEO", icon: Search },
        ]
    }
];


export default async function AdminLayout({ children }: { children: ReactNode }) {
  const layout = (await cookies()).get("react-resizable-panels:layout");
  const collapsed = (await cookies()).get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  async function handleLogout() {
    "use server";
    (await cookies()).set("user-token", "", { expires: new Date(0) });
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <Sidebar
        side="left"
        collapsible="icon"
        className="bg-sidebar-background border-r"
      >
        <SidebarHeader className="h-16 flex items-center p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
            {menuItems.map(group => (
                <SidebarGroup key={group.label}>
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarMenu>
                    {group.items.map(item => (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton tooltip={item.label}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </SidebarContent>
        <SidebarFooter>
          <form action={handleLogout}>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton type="submit" tooltip="Logout">
                        <LogOut />
                        <span>Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </form>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            {/* Can add breadcrumbs or title here */}
          </div>
          <div className="flex items-center gap-4">
            <Settings />
          </div>
        </header>
        <main className="flex-1 p-6 bg-secondary/50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
