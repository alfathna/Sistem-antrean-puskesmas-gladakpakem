import AdminLayout from '@/layouts/admin-layout';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    FileText, Search, User, Clock,
    ChevronLeft, ChevronRight, Filter, Activity
} from 'lucide-react';

interface AuditEntry {
    id: number; user_name: string; action: string; table_name: string;
    record_id: number | null; ip_address: string | null; created_at: string;
}

export default function AuditLogPage() {
    const { logs } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [filterAction, setFilterAction] = useState('');

    const filteredLogs = (logs as AuditEntry[]).filter(l => {
        const matchSearch = !search || l.user_name.toLowerCase().includes(search.toLowerCase()) || l.table_name?.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
        const matchAction = !filterAction || l.action === filterAction;
        return matchSearch && matchAction;
    });

    const actionColors: Record<string, string> = {
        create: 'bg-emerald-100 text-emerald-700',
        update: 'bg-blue-100 text-blue-700',
        delete: 'bg-red-100 text-red-700',
        login: 'bg-purple-100 text-purple-700',
        logout: 'bg-slate-100 text-slate-600',
        call_next: 'bg-amber-100 text-amber-700',
        skip: 'bg-orange-100 text-orange-700',
        register: 'bg-teal-100 text-teal-700',
    };

    const uniqueActions = [...new Set((logs as AuditEntry[]).map(l => l.action))];

    return (
        <AdminLayout title="Audit Log">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Cari log..."
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select value={filterAction} onChange={e => setFilterAction(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent">
                        <option value="">Semua Aksi</option>
                        {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tabel</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Record ID</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLogs.map((log: AuditEntry) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                        <Clock className="w-3 h-3" />
                                        {log.created_at}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><User className="w-3 h-3 text-slate-500" /></div>
                                        <span className="font-medium text-slate-700 text-xs">{log.user_name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${actionColors[log.action] || 'bg-slate-100 text-slate-600'}`}>{log.action}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono text-slate-500">
                                        {log.table_name || '-'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-slate-400">{log.record_id || '-'}</td>
                                <td className="px-4 py-3 font-mono text-[10px] text-slate-400">{log.ip_address || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredLogs.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Tidak ada log ditemukan</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
