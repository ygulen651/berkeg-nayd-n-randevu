import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Users,
    Mail,
    Phone,
    MoreVertical
} from "lucide-react"
import { getEmployees } from "@/actions/employee-actions"
import { AddEmployeeDialog } from "@/components/add-employee-dialog"

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
                                        <p className="text-sm text-primary font-medium">{staff.role} - {staff.employee?.position || "Pozisyon Belirtilmedi"}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="w-4 h-4" />
                                    {staff.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="w-4 h-4" />
                                    {staff.phone}
                                </div>
                                <hr className="my-2" />
                                <div className="flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
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
