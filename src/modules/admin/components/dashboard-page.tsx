import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  ImageIcon,
  Image as GalleryIcon,
  Info,
  Briefcase,
  Users,
  MessageSquare,
  Contact,
  Footprints,
  Search,
} from "lucide-react";

const sections = [
  { name: "Hero", href: "/admin/hero", icon: ImageIcon },
  { name: "Gallery", href: "/admin/gallery", icon: GalleryIcon },
  { name: "About", href: "/admin/about", icon: Info },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "Portfolio", href: "/admin/portfolio", icon: Users },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Contact", href: "/admin/contact", icon: Contact },
  { name: "Footer", href: "/admin/footer", icon: Footprints },
  { name: "SEO", href: "/admin/seo", icon: Search },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to the H&F Media House Content Management System. Select a section to start editing.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sections.map(section => {
            const Icon = section.icon;
            return (
          <Link href={section.href} key={section.name}>
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{section.name}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground group-hover:text-accent-foreground">
                  Edit the {section.name} section
                </p>
              </CardContent>
            </Card>
          </Link>
        )})}
      </div>
    </div>
  );
}
