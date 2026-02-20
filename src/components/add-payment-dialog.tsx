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
import { WalletCards, Loader2 } from "lucide-react"
import { createTransaction } from "@/actions/finance-actions"

const formSchema = z.object({
    amount: z.string().min(1, "Tutar gereklidir"),
    relatedId: z.string().min(1, "Personel seçimi gereklidir"),
    date: z.string().min(1, "Tarih gereklidir"),
    description: z.string().optional().or(z.literal("")),
})

interface AddPaymentDialogProps {
    employees: any[]
}

export function AddPaymentDialog({ employees }: AddPaymentDialogProps) {
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
            relatedId: "",
            date: new Date().toISOString().split('T')[0],
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const result = await createTransaction({
            ...values,
            type: "EXPENSE",
            category: "PERSONNEL_PAYMENT",
            title: "Personel Ödemesi",
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
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 opacity-50" disabled>
                <WalletCards className="w-4 h-4" />
                Personel Ödemesi Yap
            </Button>
        )
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <WalletCards className="w-4 h-4" />
                    Personel Ödemesi Yap
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Personel Ödemesi Kaydet</DialogTitle>
                    <DialogDescription>
                        Personele yapılan ödeme bilgilerini girin. Bu işlem gider olarak kaydedilecektir.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Personel</label>
                        <Select onValueChange={(val) => form.setValue("relatedId", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Personel seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((e) => (
                                    <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.relatedId && <p className="text-xs text-red-500">{form.formState.errors.relatedId.message}</p>}
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
                        <Input {...form.register("description")} placeholder="Maaş, avans vb." />
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Ödemeyi Kaydet
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
