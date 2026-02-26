import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
    Users, Plus, Pencil, Trash2, Save, X,
    User, Mail, Shield, Phone, ToggleLeft, Hash
} from 'lucide-react';

interface UserData {
    id: number; name: string; username: string; email: string;
    role: string; phone: string | null; is_active: boolean;
}

export default function UsersPage() {
    const { users } = usePage().props as any;
    const [editing, setEditing] = useState<UserData | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'receptionist', phone: '', is_active: true });

    const resetForm = () => { setForm({ name: '', username: '', email: '', password: '', role: 'receptionist', phone: '', is_active: true }); setEditing(null); setCreating(false); };

    const handleSubmit = () => {
        const method = editing ? 'put' : 'post';
        const url = editing ? `/admin/users/${editing.id}` : '/admin/users';
        const payload = editing && !form.password ? { ...form, password: undefined } : form;
        router[method](url, payload as any, {
            preserveScroll: true,
            onSuccess: () => { resetForm(); Swal.fire({ icon: 'success', title: 'Berhasil!', text: editing ? 'Pengguna berhasil diperbarui.' : 'Pengguna berhasil ditambahkan.', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }); },
            onError: () => Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan.', confirmButtonColor: '#0d9488' }),
        });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Pengguna?', text: 'Data yang dihapus tidak dapat dikembalikan.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal',
        }).then((r) => { if (r.isConfirmed) router.delete(`/admin/users/${id}`, { preserveScroll: true, onSuccess: () => Swal.fire({ icon: 'success', title: 'Terhapus!', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }) }); });
    };

    const startEdit = (u: UserData) => {
        setEditing(u); setCreating(true);
        setForm({ name: u.name, username: u.username, email: u.email, password: '', role: u.role, phone: u.phone || '', is_active: u.is_active });
    };

    const roleColors: Record<string, string> = { admin: 'bg-purple-100 text-purple-700', receptionist: 'bg-blue-100 text-blue-700', doctor: 'bg-teal-100 text-teal-700' };

    return (
        <AdminLayout title="Pengguna">
            {!creating && (
                <button onClick={() => setCreating(true)} className="mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Tambah Pengguna
                </button>
            )}

            {creating && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5 animate-fadeIn">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-teal-500" /> {editing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <FF icon={<User />} label="Nama" value={form.name} onChange={v => setForm({...form, name: v})} />
                        <FF icon={<Hash />} label="Username" value={form.username} onChange={v => setForm({...form, username: v})} />
                        <FF icon={<Mail />} label="Email" value={form.email} onChange={v => setForm({...form, email: v})} type="email" />
                        <FF icon={<Shield />} label={editing ? 'Password (kosongkan jika tidak diubah)' : 'Password'} value={form.password} onChange={v => setForm({...form, password: v})} type="password" />
                        <div>
                            <label className="text-[10px] text-slate-500 font-medium block mb-1 uppercase tracking-wider">Role</label>
                            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent">
                                <option value="admin">Admin</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                        <FF icon={<Phone />} label="Telepon" value={form.phone} onChange={v => setForm({...form, phone: v})} />
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button onClick={handleSubmit} className="bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"><Save className="w-4 h-4" /> {editing ? 'Perbarui' : 'Simpan'}</button>
                        <button onClick={resetForm} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"><X className="w-4 h-4" /> Batal</button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u: UserData) => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">{u.name[0]}</div>
                                        <span className="font-medium text-slate-700">{u.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-slate-500">{u.username}</td>
                                <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                                <td className="px-4 py-3 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${roleColors[u.role] || 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${u.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                        <ToggleLeft className="w-3 h-3" /> {u.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => startEdit(u)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="text-center py-10 text-slate-400"><Users className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">Belum ada data pengguna</p></div>}
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
        </AdminLayout>
    );
}

function FF({ icon, label, value, onChange, type = 'text', placeholder = '' }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
    return (
        <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-1 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 [&>svg]:w-3.5 [&>svg]:h-3.5">{icon}</div>
                <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
            </div>
        </div>
    );
}
