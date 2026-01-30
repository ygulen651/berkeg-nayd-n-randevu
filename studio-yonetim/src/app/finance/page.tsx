import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    CreditCard,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"

export default function FinancePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Finans</h2>
                <p className="text-muted-foreground">Stüdyo gelirlerini, giderlerini ve ödemeleri takip edin.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Gelir (Bu Ay)</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₺0.00</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            Geçen aya göre veri yok
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Gider (Bu Ay)</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₺0.00</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            Geçen aya göre veri yok
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bekleyen Ödemeler</CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₺0.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Bekleyen ödeme bulunmuyor
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Son Finansal Hareketler</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-center py-8 text-muted-foreground">
                        <p className="text-sm">Henüz finansal hareket bulunmuyor.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
