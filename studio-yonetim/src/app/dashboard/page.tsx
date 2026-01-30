import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Camera,
    Clock,
    AlertCircle,
    CreditCard,
    PlusCircle,
    UserPlus,
    Send,
    Calendar as CalendarIcon
} from "lucide-react"
import Link from "next/link"
import { getShoots } from "@/actions/shoot-actions"
import { getTasks } from "@/actions/task-actions"
import { getCustomers } from "@/actions/customer-actions"

export default async function DashboardPage() {
    const shoots = await getShoots()
    const tasks = await getTasks()
    const customers = await getCustomers()

    // Basit istatistik hesaplamaları
    const today = new Date().toISOString().split('T')[0]
    const todayShoots = (shoots as any[]).filter(s => new Date(s.startDateTime).toISOString().startsWith(today))
    const pendingTasks = (tasks as any[]).filter(t => t.status !== "COMPLETED")
    const totalRevenue = (shoots as any[]).reduce((acc, s) => acc + s.totalPrice, 0)

    const stats = [
        { title: "Bugünkü Çekimler", value: todayShoots.length.toString(), icon: Camera, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Aktif Görevler", value: pendingTasks.length.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
        { title: "Toplam Müşteri", value: customers.length.toString(), icon: UserPlus, color: "text-purple-600", bg: "bg-purple-100" },
        { title: "Toplam Ciro", value: `₺${totalRevenue.toLocaleString("tr-TR")}`, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-100" },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Hoşgeldiniz, Admin</h2>
                <p className="text-muted-foreground">İşte stüdyonuzun bugünkü özeti.</p>
            </div>

            {/* Hızlı Butonlar */}
            <div className="flex flex-wrap gap-4">
                <Link href="/shoots">
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Yeni Çekim
                    </Button>
                </Link>
                <Link href="/customers">
                    <Button variant="outline" className="gap-2">
                        <UserPlus className="w-4 h-4" />
                        Yeni Müşteri
                    </Button>
                </Link>
                <Link href="/tasks">
                    <Button variant="outline" className="gap-2">
                        <Send className="w-4 h-4" />
                        Görev Ata
                    </Button>
                </Link>
            </div>

            {/* Özet Kartları */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 h-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Bekleyen Çekimler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {shoots.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground text-sm">Henüz çekim kaydı yok.</p>
                            ) : (
                                (shoots as any[]).slice(0, 5).map((shoot: any) => (
                                    <div key={shoot.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="bg-primary/10 p-2 rounded text-primary">
                                            <CalendarIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">{shoot.customer?.name}</h4>
                                            <p className="text-xs text-muted-foreground">{shoot.title} - {new Date(shoot.startDateTime).toLocaleDateString("tr-TR")}</p>
                                        </div>
                                        <Link href="/shoots" className="ml-auto">
                                            <Button variant="ghost" size="sm">Detay</Button>
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Son Görevler</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {tasks.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground text-sm">Görev bulunmuyor.</p>
                            ) : (
                                (tasks as any[]).slice(0, 5).map((task: any) => (
                                    <div key={task.id} className="flex items-start gap-3 text-sm">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full ${task.status === "COMPLETED" ? "bg-green-500" : "bg-amber-500"}`} />
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-xs text-muted-foreground">Atanan: {task.assignee?.name}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
