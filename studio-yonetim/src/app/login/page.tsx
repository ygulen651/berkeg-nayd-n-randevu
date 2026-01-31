"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, Lock, Mail, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/dashboard" })
        } catch (error) {
            setError("Google ile giriş yapılırken bir hata oluştu.")
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setSuccessMessage(null)

        try {
            if (isLogin) {
                const result = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                })

                if (result?.error) {
                    setError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.")
                } else {
                    router.push("/dashboard")
                    router.refresh()
                }
            } else {
                // Registration Logic
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                })

                const data = await res.json()

                if (!res.ok) {
                    throw new Error(data.message || "Kayıt oluşturulamadı.")
                }

                setSuccessMessage("Kayıt başarılı! Şimdi giriş yapabilirsiniz.")
                setIsLogin(true)
                setPassword("")
            }
        } catch (err: any) {
            setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/login_background.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-60 scale-105 blur-[2px]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-transparent to-slate-950/80" />
            </div>

            {/* Animated Circles for extra depth */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-700" />

            <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center gap-12">
                {/* Huge Logo - The Star of the Show */}
                <div className="relative w-full max-w-[700px] h-[450px] transform hover:scale-105 transition-transform duration-1000 cursor-default drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]">
                    <Image
                        src="/YENİ LOGO SİYAH PNG.png"
                        alt="Berke Günaydın Logo"
                        fill
                        className="object-contain invert brightness-0"
                        priority
                    />
                </div>

                {/* Minimalist Login Form - Appears subtly */}
                <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
                    {successMessage && (
                        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                            <p className="text-sm font-medium">{successMessage}</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {!isLogin && (
                                <div className="relative group animate-in slide-in-from-left-2 fade-in duration-300">
                                    <Input
                                        type="text"
                                        placeholder="İsim Soyisim"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={!isLogin}
                                        className="pl-4 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-base rounded-full"
                                    />
                                </div>
                            )}
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="E-posta"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-base rounded-full"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="Şifre"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all text-base rounded-full"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold rounded-full transition-all active:scale-95 disabled:opacity-70 group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? "Giriş" : "Kayıt Ol"}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setError(null)
                                    setSuccessMessage(null)
                                }}
                                className="text-sm text-slate-500 hover:text-white transition-colors underline-offset-4 hover:underline"
                            >
                                {isLogin ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap"}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-slate-600">
                                    Veya
                                </span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full h-12 bg-white/5 border border-white/10 text-white hover:bg-white/10 font-medium rounded-full transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google ile Giriş Yap
                        </Button>
                    </form>

                    <p className="text-center text-[10px] uppercase tracking-[0.2em] text-slate-600 hover:text-slate-400 transition-colors cursor-default">
                        Yetkili Erişimi
                    </p>
                </div>
            </div>

            <style jsx global>{`
                body {
                    background: #020617;
                }
            `}</style>
        </div>
    )
}
