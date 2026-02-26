import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
    Stethoscope, Plus, Pencil, Trash2, Save, X,
    User, Hospital, ToggleLeft
} from 'lucide-react';

interface Doctor {
    id: number; name: string; nip: string | null; sip_number: string | null;
    specialization: string | null; poly_id: number; bpjs_doctor_code: string | null;
    is_active: boolean; polyclinic: { id: number; name: string } | null;
}
interface Poly { id: number; name: string; }

export default function DoctorsPage() {
    const { doctors, polyclinics } = usePage().props as any;
    const [editing, setEditing] = useState<Doctor | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ name: '', nip: '', sip_number: '', specialization: '', poly_id: polyclinics[0]?.id || 0, bpjs_doctor_code: '', is_active: true });

    const resetForm = () => { setForm({ name: '', nip: '', sip_number: '', specialization: '', poly_id: polyclinics[0]?.id || 0, bpjs_doctor_code: '', is_active: true }); setEditing(null); setCreating(false); };

    const handleSubmit = () => {
        const method = editing ? 'put' : 'post';
        const url = editing ? `/admin/doctors/${editing.id}` : '/admin/doctors';
        router[method](url, form, {
            preserveScroll: true,
            onSuccess: () => { resetForm(); Swal.fire({ icon: 'success', title: 'Berhasil!', text: editing ? 'Dokter berhasil diperbarui.' : 'Dokter berhasil ditambahkan.', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }); },
            onError: () => Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan.', confirmButtonColor: '#0d9488' }),
        });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Hapus Dokter?', text: 'Data yang dihapus tidak dapat dikembalikan.', icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b', confirmButtonText: 'Ya, hapus!', cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) router.delete(`/admin/doctors/${id}`, { preserveScroll: true, onSuccess: () => Swal.fire({ icon: 'success', title: 'Terhapus!', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }) });
        });
    };

    const startEdit = (d: Doctor) => {
        setEditing(d); setCreating(true);
        setForm({ name: d.name, nip: d.nip || '', sip_number: d.sip_number || '', specialization: d.specialization || '', poly_id: d.poly_id, bpjs_doctor_code: d.bpjs_doctor_code || '', is_active: d.is_active });
    };

    return (
        <AdminLayout title="Dokter">
            {!creating && (
                <button onClick={() => setCreating(true)} className="mb-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                    <Plus className="w-4 h-4" /> Tambah Dokter
                </button>
            )}

            {creating && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-5 animate-fadeIn">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Stethoscope className="w-4 h-4 text-teal-500" /> {editing ? 'Edit Dokter' : 'Tambah Dokter Baru'}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <FF label="Nama" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="dr. Ahmad" />
                        <FF label="NIP" value={form.nip} onChange={v => setForm({...form, nip: v})} placeholder="198501..." />
                        <FF label="No. SIP" value={form.sip_number} onChange={v => setForm({...form, sip_number: v})} placeholder="SIP-001" />
                        <FF label="Spesialisasi" value={form.specialization} onChange={v => setForm({...form, specialization: v})} placeholder="Umum" />
                        <div>
                            <label className="text-[10px] text-slate-500 font-medium block mb-1 uppercase tracking-wider">Poliklinik</label>
                            <select value={form.poly_id} onChange={e => setForm({...form, poly_id: Number(e.target.value)})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent">
                                {polyclinics.map((p: Poly) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <FF label="Kode Dokter BPJS" value={form.bpjs_doctor_code} onChange={v => setForm({...form, bpjs_doctor_code: v})} placeholder="BPJS-001" />
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
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">NIP</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Spesialisasi</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Poli</th>
                        <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {doctors.map((d: Doctor) => (
                            <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center"><Stethoscope className="w-3.5 h-3.5 text-indigo-600" /></div>
                                        <span className="font-medium text-slate-700">{d.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-slate-500">{d.nip || '-'}</td>
                                <td className="px-4 py-3 text-slate-500">{d.specialization || '-'}</td>
                                <td className="px-4 py-3"><span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-xs font-medium">{d.polyclinic?.name || '-'}</span></td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${d.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                        <ToggleLeft className="w-3 h-3" /> {d.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => startEdit(d)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                        <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {doctors.length === 0 && <div className="text-center py-10 text-slate-400"><Stethoscope className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">Belum ada data dokter</p></div>}
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
        </AdminLayout>
    );
}

function FF({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
    return (
        <div>
            <label className="text-[10px] text-slate-500 font-medium block mb-1 uppercase tracking-wider">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all" />
        </div>
    );
}
