import AdminLayout from '@/layouts/admin-layout';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
    Settings, Save, Clock, Users, ToggleLeft,
    Timer, Bell, Volume2
} from 'lucide-react';

interface QueueConfigItem {
    id: number; config_key: string; config_value: string; description: string | null;
}

export default function QueueConfigPage() {
    const { configs } = usePage().props as any;
    const [formData, setFormData] = useState<Record<string, string>>(() => {
        const data: Record<string, string> = {};
        (configs as QueueConfigItem[]).forEach((c) => { data[c.config_key] = c.config_value; });
        return data;
    });

    const handleSave = () => {
        const payload = Object.entries(formData).map(([config_key, config_value]) => ({ config_key, config_value }));
        router.post('/admin/queue-config', { configs: payload }, {
            preserveScroll: true,
            onSuccess: () => Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Konfigurasi berhasil disimpan.', confirmButtonColor: '#0d9488', timer: 2000, timerProgressBar: true }),
            onError: () => Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan saat menyimpan.', confirmButtonColor: '#0d9488' }),
        });
    };

    const configIcons: Record<string, React.ReactNode> = {
        daily_quota_default: <Users className="w-4 h-4 text-blue-500" />,
        max_priority_percentage: <ToggleLeft className="w-4 h-4 text-amber-500" />,
        avg_service_minutes: <Timer className="w-4 h-4 text-purple-500" />,
        tts_enabled: <Volume2 className="w-4 h-4 text-emerald-500" />,
        auto_close_hour: <Clock className="w-4 h-4 text-red-500" />,
        counter_count: <Settings className="w-4 h-4 text-teal-500" />,
        notification_enabled: <Bell className="w-4 h-4 text-orange-500" />,
        operating_hours: <Clock className="w-4 h-4 text-sky-500" />,
    };

    const configLabels: Record<string, string> = {
        daily_quota_default: 'Kuota Harian Default',
        max_priority_percentage: 'Max % Prioritas',
        avg_service_minutes: 'Rata-rata Waktu Layanan (menit)',
        tts_enabled: 'Text-to-Speech Aktif',
        auto_close_hour: 'Jam Tutup Otomatis',
        counter_count: 'Jumlah Loket',
        notification_enabled: 'Notifikasi Aktif',
        operating_hours: 'Jam Operasional',
    };

    return (
        <AdminLayout title="Konfigurasi Antrean">
            <div className="max-w-2xl">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-teal-500" />
                        <h3 className="font-bold text-sm text-slate-800">Pengaturan Sistem Antrean</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        {(configs as QueueConfigItem[]).map((config) => (
                            <div key={config.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                    {configIcons[config.config_key] || <Settings className="w-4 h-4 text-slate-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <label className="text-sm font-medium text-slate-700">{configLabels[config.config_key] || config.config_key}</label>
                                    {config.description && <p className="text-[10px] text-slate-400 mt-0.5">{config.description}</p>}
                                    {config.config_key === 'tts_enabled' || config.config_key === 'notification_enabled' ? (
                                        <div className="mt-2">
                                            <button
                                                onClick={() => setFormData({ ...formData, [config.config_key]: formData[config.config_key] === 'true' ? 'false' : 'true' })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData[config.config_key] === 'true' ? 'bg-teal-500' : 'bg-slate-300'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${formData[config.config_key] === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                            <span className={`ml-2 text-xs font-medium ${formData[config.config_key] === 'true' ? 'text-teal-600' : 'text-slate-400'}`}>
                                                {formData[config.config_key] === 'true' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={formData[config.config_key] || ''}
                                            onChange={e => setFormData({ ...formData, [config.config_key]: e.target.value })}
                                            className="mt-2 w-full max-w-xs border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-5 py-4 border-t border-slate-100">
                        <button onClick={handleSave}
                            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                            <Save className="w-4 h-4" /> Simpan Konfigurasi
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
