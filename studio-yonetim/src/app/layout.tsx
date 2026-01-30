"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="tr">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            {!isLoginPage && <AppSidebar />}
            <main className={`flex-1 overflow-auto ${!isLoginPage ? 'bg-slate-50/50' : ''}`}>
              <div className={!isLoginPage ? "p-4 md:p-8" : ""}>
                {!isLoginPage && (
                  <div className="flex items-center gap-4 mb-8 md:hidden">
                    <SidebarTrigger />
                    <h1 className="text-xl font-bold">StudioYönetim</h1>
                  </div>
                )}
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
