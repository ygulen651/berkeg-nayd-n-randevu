"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Camera, Loader2, PlusCircle } from "lucide-react"
import { createShoot } from "@/actions/shoot-actions"

const formSchema = z.object({
    customerId: z.string().min(1, "Müşteri seçimi gereklidir"),
    title: z.string().min(2, "Çekim adı/başlığı gereklidir"),
    type: z.string().min(1, "Çekim türü gereklidir"),
    date: z.string().min(1, "Tarih seçilmelidir"),
    startTime: z.string().min(1, "Başlangıç saati gereklidir"),
    endTime: z.string().min(1, "Bitiş saati gereklidir"),
    location: z.string().optional().or(z.literal("")),
    package: z.string().optional().or(z.literal("")),
    totalPrice: z.coerce.number().min(0),
    deposit: z.coerce.number().min(0),
})

type FormValues = z.infer<typeof formSchema>

interface AddShootDialogProps {
    customers: any[]
}

export function AddShootDialog({ customers }: AddShootDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            customerId: "",
            title: "",
            type: "Düğün",
            date: "",
            startTime: "09:00",
            endTime: "10:00",
            location: "",
            package: "",
            totalPrice: 0,
            deposit: 0,
        },
    })

    async function onSubmit(values: FormValues) {
        setLoading(true)

        const startDateTime = new Date(`${values.date}T${values.startTime}`)
        const endDateTime = new Date(`${values.date}T${values.endTime}`)

        const result = await createShoot({
            customerId: values.customerId,
            title: values.title,
            type: values.type,
            startDateTime,
            endDateTime,
            location: values.location,
            package: values.package,
            totalPrice: values.totalPrice,
            deposit: values.deposit,
        })

        setLoading(false)

        if (result.success) {
            setOpen(false)
            form.reset()
        } else {
            alert("Hata: " + result.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Yeni Randevu / Çekim
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Yeni Çekim Kaydı Oluştur</DialogTitle>
                    <DialogDescription>
                        Takvime yeni bir çekim randevusu ekleyin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Müşteri Seçin</label>
                            <Select onValueChange={(val) => form.setValue("customerId", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Müşteri ara/seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.length === 0 ? (
                                        <SelectItem value="none" disabled>Müşteri kaydı yok</SelectItem>
                                    ) : (
                                        customers.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Çekim Başlığı / Detayı</label>
                            <Input {...form.register("title")} placeholder="Örn: X Çifti Düğün Çekimi" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Çekim Türü</label>
                            <Select onValueChange={(val) => form.setValue("type", val)} defaultValue="Düğün">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Düğün">Düğün</SelectItem>
                                    <SelectItem value="Nişan">Nişan</SelectItem>
                                    <SelectItem value="Dış Çekim">Dış Çekim</SelectItem>
                                    <SelectItem value="Ürün">Ürün</SelectItem>
                                    <SelectItem value="Konsept">Konsept</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tarih</label>
                            <Input {...form.register("date")} type="date" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Başlangıç Saati</label>
                            <Input {...form.register("startTime")} type="time" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bitiş Saati</label>
                            <Input {...form.register("endTime")} type="time" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Toplam Ücret (₺)</label>
                            <Input {...form.register("totalPrice")} type="number" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alınan Kapora (₺)</label>
                            <Input {...form.register("deposit")} type="number" />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Konum / Adres (Opsiyonel)</label>
                            <Input {...form.register("location")} placeholder="Örn: Karaman Kalesi" />
                        </div>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Randevuyu Kaydet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
