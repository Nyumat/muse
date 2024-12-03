import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BG_URL } from "@/main";
import { ReactNode } from "react";

export function DashboardPageLayout({
  children,
  breadcrumbs,
}: {
  children: ReactNode;
  breadcrumbs: ReactNode;
}) {
  return (
    <>
      <div
        className={cn(
          "flex flex-col h-full bg-cover bg-center bg-fixed bg-no-repeat border border-prrimary rounded"
        )}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${BG_URL}')`,
        }}
      >
        <header className="flex h-16 shrink-0 items-center gap-2 border-primary">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>{breadcrumbs}</BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Separator />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </>
  );
}
