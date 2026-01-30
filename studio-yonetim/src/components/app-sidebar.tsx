"use client"

import {
    Calendar,
    Camera,
    ChevronRight,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Settings,
    Users,
    CheckSquare,
    UserCircle,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"

const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Takvim", url: "/calendar", icon: Calendar },
    { title: "Çekimler", url: "/shoots", icon: Camera },
    { title: "Müşteriler", url: "/customers", icon: Users },
    { title: "Görevler", url: "/tasks", icon: CheckSquare },
    { title: "Personel", url: "/employees", icon: UserCircle },
    { title: "Finans", url: "/finance", icon: CreditCard },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className="p-6 border-b bg-white">
                <div className="flex items-center justify-center w-full">
                    <div className="relative w-full h-24 transform hover:scale-105 transition-transform duration-500">
                        <Image
                            src="/YENİ LOGO SİYAH PNG.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menü</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url} className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Çıkış Yap</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
