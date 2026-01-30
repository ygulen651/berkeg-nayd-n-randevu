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
    MoreVertical,
    History,
    Phone
} from "lucide-react"
import { getCustomers } from "@/actions/customer-actions"
import { AddCustomerDialog } from "@/components/add-customer-dialog"

export default async function CustomersPage() {
    const customers = await getCustomers()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Müşteriler</h2>
                    <p className="text-muted-foreground">Müşteri veritabanınızı ve çekim geçmişlerini yönetin.</p>
                </div>
                <AddCustomerDialog />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="İsim, e-posta veya telefon ile ara..." className="pl-10" />
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
                            <TableHead>Müşteri Bilgileri</TableHead>
                            <TableHead>İletişim</TableHead>
                            <TableHead>Eklenme Tarihi</TableHead>
                            <TableHead>Notlar</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                                    Henüz müşteri kaydı bulunmuyor. "Yeni Müşteri" butonu ile eklemeye başlayabilirsiniz.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer: any) => (
                                <TableRow key={customer.id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>
                                        <div className="text-sm">{customer.phone || "-"}</div>
                                        <div className="text-xs text-muted-foreground">{customer.email || "-"}</div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                                        {customer.notes || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                                <History className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                                <Phone className="w-4 h-4" />
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
