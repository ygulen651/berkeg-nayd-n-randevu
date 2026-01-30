import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    Mail,
    Phone,
    MoreVertical,
    Trash2
} from "lucide-react"
import { getEmployees, deleteEmployee } from "@/actions/employee-actions"
import { AddEmployeeDialog } from "@/components/add-employee-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default async function EmployeesPage() {
    const employees = await getEmployees()

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Personel</h2>
                    <p className="text-muted-foreground">Ekibinizi yönetin ve yetkilendirmeleri düzenleyin.</p>
                </div>
                <AddEmployeeDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {employees.length === 0 ? (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                        Henüz personel eklenmemiş. "Yeni Personel" butonu ile başlayabilirsiniz.
                    </div>
                ) : (
                    employees.map((staff: any) => (
                        <Card key={staff.id} className="hover:shadow-lg transition-shadow overflow-hidden group">
                            <CardHeader className="bg-slate-50/50 pb-4 relative">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{staff.name}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs px-2 py-0.5 bg-slate-200 rounded-full font-semibold">{staff.role}</span>
                                            <span className="text-xs text-muted-foreground font-medium">{staff.employee?.position || "Pozisyon Belirtilmedi"}</span>
                                        </div>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <form action={async () => {
                                            "use server"
                                            await deleteEmployee(staff.id)
                                        }}>
                                            <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                                                <button type="submit" className="flex items-center w-full">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Personeli Sil
                                                </button>
                                            </DropdownMenuItem>
                                        </form>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {staff.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {staff.phone || "Telefon Belirtilmedi"}
                                </div>
                                <hr className="my-2 border-slate-100" />
                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-muted-foreground">
                                        Eklenme: {new Date(staff.createdAt).toLocaleDateString("tr-TR")}
                                    </div>
                                    <Button variant="outline" size="sm" className="h-8 py-0 px-3 text-xs">
                                        Profil
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
