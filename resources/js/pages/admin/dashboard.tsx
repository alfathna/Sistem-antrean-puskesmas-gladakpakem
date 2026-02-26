import AdminLayout from '@/layouts/admin-layout';
import { usePage } from '@inertiajs/react';
import {
    Users, Clock, CheckCircle2, TrendingUp, Star,
    ArrowUpRight, ArrowDownRight, Activity, Stethoscope,
    Timer, UserCheck, AlertTriangle
} from 'lucide-react';

interface Stats {
    totalToday: number;
    waiting: number;
    registered: number;
    priorityCount: number;
    newPatients: number;
    oldPatients: number;
    bpjsPatients: number;
    umumPatients: number;
    avgWaitMinutes: number;
}
interface PolyStat { name: string; total: number; waiting: number; done: number; }

export default function AdminDashboard() {
    const { stats, polyStats } = usePage().props as any as { stats: Stats; polyStats: PolyStat[] };

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Users className="w-5 h-5" />} label="Total Antrean Hari Ini" value={stats.totalToday} color="blue" />
                <StatCard icon={<Clock className="w-5 h-5" />} label="Menunggu" value={stats.waiting} color="amber" />
                <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Sudah Terdaftar" value={stats.registered} color="emerald" />
                <StatCard icon={<Timer className="w-5 h-5" />} label="Rata-rata Tunggu" value={`${stats.avgWaitMinutes} mnt`} color="purple" />
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Per-Poly Stats */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                            <Stethoscope className="w-4 h-4 text-teal-500" /> Statistik Per Poliklinik
                        </h3>
                        <span className="text-xs text-slate-400">Hari ini</span>
                    </div>
                    <div className="p-5">
                        {polyStats.length > 0 ? (
                            <div className="space-y-3">
                                {polyStats.map((poly, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-28 text-sm font-medium text-slate-700 truncate">{poly.name}</div>
                                        <div className="flex-1">
                                            <div className="h-6 bg-slate-100 rounded-full overflow-hidden flex">
                                                {poly.done > 0 && (
                                                    <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-l-full transition-all duration-500 flex items-center justify-end pr-2"
                                                        style={{ width: `${Math.max(10, (poly.done / (poly.total || 1)) * 100)}%` }}>
                                                        <span className="text-[10px] font-bold text-white">{poly.done}</span>
                                                    </div>
                                                )}
                                                {poly.waiting > 0 && (
                                                    <div className="h-full bg-gradient-to-r from-amber-300 to-amber-400 transition-all duration-500 flex items-center justify-end pr-2"
                                                        style={{ width: `${Math.max(5, (poly.waiting / (poly.total || 1)) * 100)}%` }}>
                                                        <span className="text-[10px] font-bold text-amber-800">{poly.waiting}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 w-10 text-right">{poly.total}</div>
                                    </div>
                                ))}
                                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-400">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-400" /> Selesai</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Menunggu</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-400">
                                <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Belum ada data hari ini</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-teal-500" /> Jenis Pembayaran
                        </h3>
                        <div className="space-y-3">
                            <BreakdownBar label="BPJS" value={stats.bpjsPatients} total={stats.bpjsPatients + stats.umumPatients} color="emerald" />
                            <BreakdownBar label="Umum" value={stats.umumPatients} total={stats.bpjsPatients + stats.umumPatients} color="sky" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500" /> Ringkasan
                        </h3>
                        <div className="space-y-2">
                            <SummaryRow label="Pasien Prioritas" value={stats.priorityCount} />
                            <SummaryRow label="Pasien Baru" value={stats.newPatients} />
                            <SummaryRow label="Pasien Lama" value={stats.oldPatients} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode; label: string; value: string | number; color: string;
}) {
    const colors: Record<string, { bg: string; icon: string }> = {
        blue: { bg: 'bg-blue-50', icon: 'bg-blue-500' },
        amber: { bg: 'bg-amber-50', icon: 'bg-amber-500' },
        emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500' },
        purple: { bg: 'bg-purple-50', icon: 'bg-purple-500' },
    };
    const c = colors[color] || colors.blue;

    return (
        <div className={`${c.bg} rounded-xl p-4 border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow`}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
            <div className={`w-10 h-10 rounded-xl ${c.icon} text-white flex items-center justify-center shadow-lg mb-3`}>{icon}</div>
            <div className="text-2xl font-black text-slate-800">{value}</div>
            <div className="text-xs text-slate-500 mt-1">{label}</div>
        </div>
    );
}

function BreakdownBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    const barColors: Record<string, string> = {
        emerald: 'bg-gradient-to-r from-emerald-400 to-emerald-500',
        sky: 'bg-gradient-to-r from-sky-400 to-sky-500',
    };
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">{label}</span>
                <span className="text-slate-400">{value} ({pct}%)</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${barColors[color]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex justify-between py-1.5 text-sm border-b border-slate-50 last:border-0">
            <span className="text-slate-500">{label}</span>
            <span className="font-bold text-slate-700">{value}</span>
        </div>
    );
}
