import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
    Hospital, Plus, Pencil, Trash2, Save, X,
    Hash, FileText, Users as UsersIcon, Clock, ToggleLeft
} from 'lucide-react';

interface Polyclinic {
    id: number; code: string; name: string; queue_prefix: string;
    quota_per_day: number; is_active: boolean; description: string | null;
}

export default function PolyclinicsPage() {
    const { polyclinics } = usePage().props as any;
    const [editing, setEditing] = useState<Polyclinic | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ code: '', name: '', queue_prefix: '', quota_per_day: 50, description: '', is_active: true });

    const resetForm = () => {
        setForm({ code: '', name: '', queue_prefix: '', quota_per_day: 50, description: '', is_active: true });
        setEditing(null);
        setCreating(false);
    };

    const handleSubmit = () => {
        if (editing) {
            router.put(`/admin/polyclinics/${editing.id}`, form, {
                preserveScroll: true,
                onSuccess: () => { resetForm(); Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Poliklinik berhasil diperbarui.', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }); },
                onError: () => Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan.', confirmButtonColor: '#0d9488' }),
            });
        } else {
            router.post('/admin/polyclinics', form, {
                preserveScroll: true,
                onSuccess: () => { resetForm(); Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Poliklinik berhasil ditambahkan.', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }); },
                onError: () => Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan.', confirmButtonColor: '#0d9488' }),
            });
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Poliklinik?',
            text: 'Data yang dihapus tidak dapat dikembalikan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/polyclinics/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Poliklinik berhasil dihapus.', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }),
                });
            }
        });
    };

    const startEdit = (p: Polyclinic) => {
        setEditing(p);
        setCreating(true);
        setForm({ code: p.code, name: p.name, queue_prefix: p.queue_prefix, quota_per_day: p.quota_per_day, description: p.description || '', is_active: p.is_active });
    };

    return (
        <AdminLayout title="Poliklinik">
            {/* Add Button */}
            {!creating && (
                <button onClick={() => setCreating(true)}
                    className="mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Tambah Poliklinik
                </button>
            )}

            {/* Form */}
            {creating && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5 animate-fadeIn">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Hospital className="w-4 h-4 text-teal-500" />
                        {editing ? 'Edit Poliklinik' : 'Tambah Poliklinik Baru'}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <FormField icon={<Hash />} label="Kode" value={form.code} onChange={v => setForm({ ...form, code: v })} placeholder="POL-001" />
                        <FormField icon={<Hospital />} label="Nama" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Poli Umum" />
                        <FormField icon={<FileText />} label="Prefix Antrean" value={form.queue_prefix} onChange={v => setForm({ ...form, queue_prefix: v })} placeholder="A" />
                        <FormField icon={<UsersIcon />} label="Kuota/Hari" value={String(form.quota_per_day)} onChange={v => setForm({ ...form, quota_per_day: Number(v) })} type="number" />
                        <div className="col-span-2">
                            <FormField icon={<FileText />} label="Deskripsi" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Deskripsi poli..." />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm">
                            <Save className="w-4 h-4" /> {editing ? 'Perbarui' : 'Simpan'}
                        </button>
                        <button onClick={resetForm} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                            <X className="w-4 h-4" /> Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prefix</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kuota</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {polyclinics.map((p: Polyclinic) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.code}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center"><Hospital className="w-3.5 h-3.5 text-teal-600" /></div>
                                        <span className="font-medium text-slate-700">{p.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono">{p.queue_prefix}</span></td>
                                <td className="px-4 py-3 text-center font-medium">{p.quota_per_day}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${p.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                        <ToggleLeft className="w-3 h-3" /> {p.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors" title="Edit">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Hapus">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {polyclinics.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <Hospital className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Belum ada data poliklinik</p>
                    </div>
                )}
            </div>

            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
        </AdminLayout>
    );
}

function FormField({ icon, label, value, onChange, type = 'text', placeholder = '' }: {
    icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
    return (
        <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-1 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</div>
                <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
            </div>
        </div>
    );
}
