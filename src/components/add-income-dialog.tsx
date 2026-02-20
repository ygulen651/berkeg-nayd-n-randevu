"use client"

import { useState, useEffect } from "react"
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
import { PlusCircle, Loader2, Camera } from "lucide-react"
import { createTransaction } from "@/actions/finance-actions"

const formSchema = z.object({
    amount: z.string().min(1, "Tutar gereklidir"),
    category: z.enum(["SICAK_CEKIM", "REZEVASYON", "ALBUM_SATIS", "DIGER"]),
    date: z.string().min(1, "Tarih gereklidir"),
    relatedId: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
})

interface AddIncomeDialogProps {
    shoots: any[]
}

export function AddIncomeDialog({ shoots }: AddIncomeDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            category: "SICAK_CEKIM",
            date: new Date().toISOString().split('T')[0],
            relatedId: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const categoryMap: Record<string, string> = {
            SICAK_CEKIM: "Sıcak Çekim Ücreti",
            REZEVASYON: "Rezervasyon Ücreti",
            ALBUM_SATIS: "Albüm Satış",
            DIGER: "Diğer Gelir"
        }

        const result = await createTransaction({
            ...values,
            type: "INCOME",
            title: categoryMap[values.category],
        })
        setLoading(false)

        if (result.success) {
            setOpen(false)
            form.reset()
        } else {
            alert("Hata: " + result.error)
        }
    }

    if (!isMounted) {
        return (
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 opacity-50" disabled>
                <PlusCircle className="w-4 h-4" />
                Sıcak Çekim Ücretleri
            </Button>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="w-4 h-4" />
                    Sıcak Çekim Ücretleri
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sıcak Çekim Kaydet</DialogTitle>
                    <DialogDescription>
                        Stüdyo için elde edilen gelir bilgisini girin.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Gelir Türü</label>
                        <Select onValueChange={(val) => form.setValue("category", val as any)} defaultValue="SICAK_CEKIM">
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SICAK_CEKIM">Sıcak Çekim Ücreti</SelectItem>
                                <SelectItem value="REZEVASYON">Rezervasyon Kaparo</SelectItem>
                                <SelectItem value="ALBUM_SATIS">Albüm / Ürün Satışı</SelectItem>
                                <SelectItem value="DIGER">Diğer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">İlgili Çekim (Opsiyonel)</label>
                        <Select onValueChange={(val) => form.setValue("relatedId", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Çekim seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">Seçilmedi</SelectItem>
                                {shoots.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        <div className="flex items-center gap-2">
                                            <Camera className="w-3 h-3 text-slate-400" />
                                            <span>{s.customer?.name} - {new Date(s.startDateTime).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4">
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Tutar (₺)</label>
                            <Input {...form.register("amount")} type="number" step="0.01" placeholder="0.00" />
                            {form.formState.errors.amount && <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>}
                        </div>
                        <div className="space-y-2 flex-1">
                            <label className="text-sm font-medium">Tarih</label>
                            <Input {...form.register("date")} type="date" />
                            {form.formState.errors.date && <p className="text-xs text-red-500">{form.formState.errors.date.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Not / Açıklama</label>
                        <Input {...form.register("description")} placeholder="İlave notlar..." />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Sıcak Çekim Kaydet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
