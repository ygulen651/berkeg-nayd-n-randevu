"use client"

import { useState, useEffect, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import trLocale from "@fullcalendar/core/locales/tr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarClientProps {
    initialEvents: any[]
}

export function CalendarClient({ initialEvents }: CalendarClientProps) {
    const calendarRef = useRef<FullCalendar>(null)
    const [view, setView] = useState("dayGridMonth")
    const [events, setEvents] = useState(initialEvents || [])

    useEffect(() => {
        if (!initialEvents) return
        // Format events for FullCalendar
        const formattedEvents = initialEvents.map(shoot => ({
            id: shoot.id || shoot._id,
            title: `${shoot.customer?.name || 'Müşteri'} - ${shoot.title}`,
            start: shoot.startDateTime,
            end: shoot.endDateTime,
            backgroundColor: getEventColor(shoot.type),
            borderColor: getEventColor(shoot.type),
        }))
        setEvents(formattedEvents)
    }, [initialEvents])

    const handleViewChange = (newView: string) => {
        setView(newView)
        const calendarApi = calendarRef.current?.getApi()
        if (calendarApi) {
            calendarApi.changeView(newView)
        }
    }

    const handlePrev = () => {
        calendarRef.current?.getApi().prev()
    }

    const handleNext = () => {
        calendarRef.current?.getApi().next()
    }

    const handleToday = () => {
        calendarRef.current?.getApi().today()
    }

    function getEventColor(type: string) {
        switch (type) {
            case "Düğün": return "#3b82f6" // blue
            case "Nişan": return "#8b5cf6" // purple
            case "Ürün": return "#10b981" // green
            case "Dış Çekim": return "#f59e0b" // amber
            default: return "#6366f1" // indigo
        }
    }

    return (
        <Card className="border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="flex flex-col md:flex-row items-center justify-between bg-slate-50/50 border-b p-4 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" />
                        Stüdyo Ajandası
                    </CardTitle>

                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={handlePrev} className="h-8 w-8">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleToday} className="h-8 text-xs">
                            Bugün
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleNext} className="h-8 w-8">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex bg-white border rounded-lg p-1 shadow-sm w-full md:w-auto justify-center">
                    <Button
                        variant={view === "dayGridMonth" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleViewChange("dayGridMonth")}
                        className="text-xs px-3 flex-1 md:flex-initial"
                    >
                        Ay
                    </Button>
                    <Button
                        variant={view === "timeGridWeek" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleViewChange("timeGridWeek")}
                        className="text-xs px-3 flex-1 md:flex-initial"
                    >
                        Hafta
                    </Button>
                    <Button
                        variant={view === "timeGridDay" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleViewChange("timeGridDay")}
                        className="text-xs px-3 flex-1 md:flex-initial"
                    >
                        Gün
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="calendar-container p-4 min-h-[700px]">
                    <style jsx global>{`
                        .fc { --fc-border-color: #e2e8f0; --fc-button-bg-color: #ffffff; --fc-button-border-color: #e2e8f0; --fc-button-text-color: #0f172a; --fc-button-hover-bg-color: #f8fafc; --fc-button-hover-border-color: #cbd5e1; --fc-button-active-bg-color: #f1f5f9; --fc-button-active-border-color: #94a3b8; }
                        .fc .fc-toolbar { margin-bottom: 20px !important; }
                        .fc .fc-toolbar-title { font-size: 1.25rem !important; font-weight: 700 !important; color: #1e293b; }
                        .fc .fc-button { text-transform: capitalize !important; font-weight: 500 !important; border-radius: 0.5rem !important; }
                        .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background-color: #f1f5f9 !important; border-color: #94a3b8 !important; color: #0f172a !important; }
                        .fc .fc-col-header-cell-cushion { padding: 12px 4px !important; color: #64748b; font-weight: 600; font-size: 0.875rem; }
                        .fc .fc-daygrid-day-number { padding: 8px !important; color: #475569; font-weight: 500; font-size: 0.8125rem; }
                        .fc .fc-event { border-radius: 4px !important; padding: 2px 4px !important; font-size: 0.75rem !important; font-weight: 500 !important; cursor: pointer; border: none !important; transition: opacity 0.2s; }
                        .fc .fc-event:hover { opacity: 0.85; }
                        .fc .fc-day-today { background-color: rgba(59, 130, 246, 0.05) !important; }
                        .fc-header-toolbar { display: none !important; }
                    `}</style>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView={view}
                        headerToolbar={false}
                        locale={trLocale}
                        events={events}
                        height="auto"
                        selectable={true}
                        editable={true}
                        dayMaxEvents={true}
                        slotMinTime="08:00:00"
                        slotMaxTime="22:00:00"
                        allDaySlot={false}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
