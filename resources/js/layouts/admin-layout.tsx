import { Head, Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Hospital, Stethoscope, Users, Settings,
    FileText, ChevronRight, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
    title: string;
    children: React.ReactNode;
}

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/polyclinics', label: 'Poliklinik', icon: Hospital },
    { href: '/admin/doctors', label: 'Dokter', icon: Stethoscope },
    { href: '/admin/users', label: 'Pengguna', icon: Users },
    { href: '/admin/queue-config', label: 'Konfigurasi', icon: Settings },
    { href: '/admin/audit-log', label: 'Audit Log', icon: FileText },
];

export default function AdminLayout({ title, children }: AdminLayoutProps) {
    const { url } = usePage();
    const user = (usePage().props as any).auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <>
            <Head title={`Admin - ${title}`} />
            <div className="min-h-screen bg-slate-50 flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-slate-900 text-white flex flex-col transition-all duration-300 shrink-0`}>
                    {/* Logo */}
                    <div className="p-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shrink-0">
                            <Hospital className="w-4 h-4 text-white" />
                        </div>
                        {sidebarOpen && (
                            <div className="overflow-hidden">
                                <div className="text-sm font-bold truncate">Puskesmas</div>
                                <div className="text-[10px] text-slate-400 truncate">Admin Panel</div>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 space-y-0.5 mt-2">
                        {navItems.map((item) => {
                            const isActive = url.startsWith(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                                        isActive
                                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Icon className="w-4 h-4 shrink-0" />
                                    {sidebarOpen && <span className="truncate">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="p-3 border-t border-slate-800">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">
                                    {user?.name?.[0] || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium truncate">{user?.name || 'Admin'}</div>
                                    <div className="text-[10px] text-slate-500 truncate">{user?.role || 'admin'}</div>
                                </div>
                                <Link href="/logout" method="post" as="button" className="p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-red-400 transition-colors">
                                    <LogOut className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ) : (
                            <Link href="/logout" method="post" as="button" className="w-full flex justify-center p-1.5 rounded-lg hover:bg-white/10 text-slate-500 hover:text-red-400">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </aside>

                {/* Main */}
                <div className="flex-1 flex flex-col min-h-screen">
                    {/* Top bar */}
                    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800">{title}</h1>
                                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                    <span>Admin</span>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                    <span className="text-teal-600 font-medium">{title}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
