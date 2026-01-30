import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    Filter,
    Calendar,
    MoreVertical,
    MessageCircle
} from "lucide-react"
import { getShoots } from "@/actions/shoot-actions"
import { getCustomers } from "@/actions/customer-actions"
import { AddShootDialog } from "@/components/add-shoot-dialog"

export default async function ShootsPage() {
    const shoots = await getShoots()
    const customers = await getCustomers()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Çekimler</h2>
                    <p className="text-muted-foreground">Stüdyo çekimlerini, randevuları ve iş süreçlerini takip edin.</p>
                </div>
                <AddShootDialog customers={customers} />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Çekim ara..." className="pl-10" />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrele
                </Button>
            </div>

            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead>Müşteri & Çekim</TableHead>
                            <TableHead>Tarih & Saat</TableHead>
                            <TableHead>Tür</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shoots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                    Henüz çekim kaydı bulunmuyor. "Yeni Randevu" butonu ile başlayabilirsiniz.
                                </TableCell>
                            </TableRow>
                        ) : (
                            shoots.map((shoot: any) => (
                                <TableRow key={shoot.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        <div className="font-medium">{shoot.customer?.name}</div>
                                        <div className="text-xs text-muted-foreground">{shoot.title}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                            {new Date(shoot.startDateTime).toLocaleDateString("tr-TR")}
                                        </div>
                                        <div className="text-xs text-muted-foreground pl-5">
                                            {new Date(shoot.startDateTime).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(shoot.endDateTime).toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-normal">
                                            {shoot.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-blue-100 text-blue-700 shadow-none border-0 hover:bg-blue-200">
                                            {shoot.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
