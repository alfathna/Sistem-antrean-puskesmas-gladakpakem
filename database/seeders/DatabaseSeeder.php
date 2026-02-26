<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\DoctorSchedule;
use App\Models\Patient;
use App\Models\Polyclinic;
use App\Models\Queue;
use App\Models\QueueConfig;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ============================================
        // 1. USERS
        // ============================================
        $admin = User::create([
            'username' => 'admin',
            'name' => 'Administrator',
            'email' => 'admin@pkmgladakpakem.go.id',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '082142146939',
            'is_active' => true,
        ]);

        $loket1 = User::create([
            'username' => 'loket1',
            'name' => 'Siti Aminah',
            'email' => 'loket1@pkmgladakpakem.go.id',
            'password' => Hash::make('loket123'),
            'role' => 'receptionist',
            'phone' => '081234567890',
            'is_active' => true,
        ]);

        $loket2 = User::create([
            'username' => 'loket2',
            'name' => 'Dewi Rahayu',
            'email' => 'loket2@pkmgladakpakem.go.id',
            'password' => Hash::make('loket123'),
            'role' => 'receptionist',
            'phone' => '081234567891',
            'is_active' => true,
        ]);

        // ============================================
        // 2. POLYCLINICS
        // ============================================
        $poliUmum = Polyclinic::create([
            'code' => 'POL-001',
            'name' => 'Poli Umum',
            'bpjs_poly_code' => '001',
            'room' => 'Ruang 1',
            'queue_prefix' => 'A',
            'quota_per_day' => 40,
            'sort_order' => 1,
        ]);

        $poliGigi = Polyclinic::create([
            'code' => 'POL-002',
            'name' => 'Poli Gigi & Mulut',
            'bpjs_poly_code' => '002',
            'room' => 'Ruang 2',
            'queue_prefix' => 'B',
            'quota_per_day' => 20,
            'sort_order' => 2,
        ]);

        $poliKia = Polyclinic::create([
            'code' => 'POL-003',
            'name' => 'Poli KIA/KB',
            'bpjs_poly_code' => '003',
            'room' => 'Ruang 3',
            'queue_prefix' => 'C',
            'quota_per_day' => 20,
            'sort_order' => 3,
        ]);

        $poliImunisasi = Polyclinic::create([
            'code' => 'POL-004',
            'name' => 'Poli Imunisasi',
            'bpjs_poly_code' => '004',
            'room' => 'Ruang 4',
            'queue_prefix' => 'D',
            'quota_per_day' => 15,
            'sort_order' => 4,
        ]);

        $ugd = Polyclinic::create([
            'code' => 'POL-005',
            'name' => 'UGD',
            'bpjs_poly_code' => '005',
            'room' => 'Ruang UGD',
            'queue_prefix' => 'E',
            'quota_per_day' => 10,
            'sort_order' => 5,
        ]);

        // ============================================
        // 3. DOCTORS
        // ============================================
        $drAhmad = Doctor::create([
            'name' => 'dr. Ahmad Fauzi',
            'nip' => '198501152010011001',
            'sip_number' => 'SIP-001-2024',
            'specialization' => 'Dokter Umum',
            'poly_id' => $poliUmum->id,
            'bpjs_doctor_code' => 'DOC001',
            'is_active' => true,
        ]);

        $drSari = Doctor::create([
            'name' => 'drg. Sari Wulandari',
            'nip' => '198703202012012002',
            'sip_number' => 'SIP-002-2024',
            'specialization' => 'Dokter Gigi',
            'poly_id' => $poliGigi->id,
            'bpjs_doctor_code' => 'DOC002',
            'is_active' => true,
        ]);

        $drRina = Doctor::create([
            'name' => 'dr. Rina Handayani',
            'nip' => '199002102015032001',
            'sip_number' => 'SIP-003-2024',
            'specialization' => 'Dokter Umum',
            'poly_id' => $poliKia->id,
            'bpjs_doctor_code' => 'DOC003',
            'is_active' => true,
        ]);

        $drBudi = Doctor::create([
            'name' => 'dr. Budi Santoso',
            'nip' => '198805152013011001',
            'sip_number' => 'SIP-004-2024',
            'specialization' => 'Dokter Umum',
            'poly_id' => $poliUmum->id,
            'bpjs_doctor_code' => 'DOC004',
            'is_active' => true,
        ]);

        // ============================================
        // 4. DOCTOR SCHEDULES (Mon-Sat)
        // ============================================
        foreach ([1, 2, 3, 4, 5, 6] as $day) {
            DoctorSchedule::create([
                'doctor_id' => $drAhmad->id,
                'poly_id' => $poliUmum->id,
                'day_of_week' => $day,
                'start_time' => '07:30',
                'end_time' => '14:00',
                'max_patient' => 40,
            ]);

            if ($day <= 5) {
                DoctorSchedule::create([
                    'doctor_id' => $drSari->id,
                    'poly_id' => $poliGigi->id,
                    'day_of_week' => $day,
                    'start_time' => '07:30',
                    'end_time' => '12:00',
                    'max_patient' => 20,
                ]);
            }

            DoctorSchedule::create([
                'doctor_id' => $drRina->id,
                'poly_id' => $poliKia->id,
                'day_of_week' => $day,
                'start_time' => '07:30',
                'end_time' => '14:00',
                'max_patient' => 20,
            ]);

            if (in_array($day, [1, 3, 5])) {
                DoctorSchedule::create([
                    'doctor_id' => $drBudi->id,
                    'poly_id' => $poliUmum->id,
                    'day_of_week' => $day,
                    'start_time' => '07:30',
                    'end_time' => '14:00',
                    'max_patient' => 40,
                ]);
            }
        }

        // ============================================
        // 5. QUEUE CONFIGS
        // ============================================
        $configs = [
            ['config_key' => 'priority_ratio', 'config_value' => '2:1', 'description' => 'Rasio pemanggilan prioritas:umum'],
            ['config_key' => 'reset_time', 'config_value' => '06:00', 'description' => 'Waktu reset antrean harian'],
            ['config_key' => 'operating_start', 'config_value' => '07:30', 'description' => 'Jam mulai operasional'],
            ['config_key' => 'operating_end', 'config_value' => '14:00', 'description' => 'Jam selesai operasional'],
            ['config_key' => 'avg_service_minutes', 'config_value' => '5', 'description' => 'Estimasi menit layanan per pasien di loket'],
            ['config_key' => 'tts_enabled', 'config_value' => 'true', 'description' => 'Aktifkan text-to-speech panggilan'],
            ['config_key' => 'wa_notification', 'config_value' => 'false', 'description' => 'Aktifkan notifikasi WhatsApp'],
            ['config_key' => 'wa_notify_before', 'config_value' => '3', 'description' => 'Notif saat N nomor sebelum giliran'],
        ];

        foreach ($configs as $config) {
            QueueConfig::create(array_merge($config, ['updated_by' => $admin->id]));
        }

        // ============================================
        // 6. SAMPLE PATIENTS
        // ============================================
        $patients = [
            [
                'medical_record' => 'RM-000001',
                'nik' => '3509120101900001',
                'bpjs_number' => '0001234567890',
                'name' => 'Budi Santoso',
                'birth_date' => '1990-01-01',
                'birth_place' => 'Jember',
                'gender' => 'L',
                'address' => 'Jl. Mastrip No. 10',
                'rt_rw' => '003/007',
                'kelurahan' => 'Kranjingan',
                'kecamatan' => 'Sumbersari',
                'kabupaten' => 'Jember',
                'phone' => '081234567001',
                'blood_type' => 'O',
                'marital_status' => 'Menikah',
                'occupation' => 'Wiraswasta',
                'is_bpjs_active' => true,
                'bpjs_class' => 'III',
                'patient_type' => 'bpjs',
            ],
            [
                'medical_record' => 'RM-000002',
                'nik' => '3509125503950002',
                'bpjs_number' => '0001234567891',
                'name' => 'Sari Wulandari',
                'birth_date' => '1995-03-15',
                'birth_place' => 'Jember',
                'gender' => 'P',
                'address' => 'Jl. Kalimantan No. 5',
                'rt_rw' => '002/004',
                'kelurahan' => 'Kebonsari',
                'kecamatan' => 'Sumbersari',
                'kabupaten' => 'Jember',
                'phone' => '081234567002',
                'blood_type' => 'A',
                'marital_status' => 'Menikah',
                'occupation' => 'IRT',
                'is_bpjs_active' => true,
                'bpjs_class' => 'III',
                'patient_type' => 'bpjs',
            ],
            [
                'medical_record' => 'RM-000003',
                'nik' => '3509121505600003',
                'name' => 'Haji Muhammad',
                'birth_date' => '1960-05-15',
                'birth_place' => 'Jember',
                'gender' => 'L',
                'address' => 'Jl. Wolter Monginsidi No. 30',
                'rt_rw' => '001/003',
                'kelurahan' => 'Kranjingan',
                'kecamatan' => 'Sumbersari',
                'kabupaten' => 'Jember',
                'phone' => '081234567003',
                'blood_type' => 'B',
                'marital_status' => 'Menikah',
                'occupation' => 'Pensiunan',
                'patient_type' => 'umum',
            ],
            [
                'medical_record' => 'RM-000004',
                'nik' => '3509124101880004',
                'bpjs_number' => '0001234567893',
                'name' => 'Nur Aini',
                'birth_date' => '1988-01-01',
                'birth_place' => 'Jember',
                'gender' => 'P',
                'address' => 'Jl. Sumatera No. 20',
                'rt_rw' => '005/002',
                'kelurahan' => 'Kebonsari',
                'kecamatan' => 'Sumbersari',
                'kabupaten' => 'Jember',
                'phone' => '081234567004',
                'marital_status' => 'Menikah',
                'occupation' => 'Guru',
                'allergy' => 'Amoxicillin',
                'is_bpjs_active' => true,
                'bpjs_class' => 'II',
                'patient_type' => 'bpjs',
            ],
            [
                'medical_record' => 'RM-000005',
                'nik' => '3509120506230005',
                'bpjs_number' => '0001234567894',
                'name' => 'Ahmad Junior',
                'birth_date' => '2023-06-05',
                'birth_place' => 'Jember',
                'gender' => 'L',
                'address' => 'Jl. Mastrip No. 10',
                'rt_rw' => '003/007',
                'kelurahan' => 'Kranjingan',
                'kecamatan' => 'Sumbersari',
                'kabupaten' => 'Jember',
                'phone' => '081234567001',
                'is_bpjs_active' => true,
                'bpjs_class' => 'III',
                'patient_type' => 'bpjs',
            ],
        ];

        foreach ($patients as $patientData) {
            Patient::create($patientData);
        }

        // ============================================
        // 7. SAMPLE QUEUES FOR TODAY
        // ============================================
        $today = now()->toDateString();

        // Priority queues
        Queue::create([
            'queue_number' => 'P-001', 'queue_prefix' => 'P', 'queue_category' => 'prioritas',
            'priority_reason' => 'lansia', 'poly_id' => $poliUmum->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'done',
            'payment_type' => 'umum', 'called_at' => now()->subMinutes(60),
            'served_at' => now()->subMinutes(55), 'completed_at' => now()->subMinutes(45),
        ]);

        Queue::create([
            'queue_number' => 'P-002', 'queue_prefix' => 'P', 'queue_category' => 'prioritas',
            'priority_reason' => 'bumil', 'poly_id' => $poliKia->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'serving',
            'payment_type' => 'bpjs', 'counter_number' => 1,
            'called_at' => now()->subMinutes(10), 'served_at' => now()->subMinutes(8),
        ]);

        Queue::create([
            'queue_number' => 'P-003', 'queue_prefix' => 'P', 'queue_category' => 'prioritas',
            'priority_reason' => 'bumil', 'poly_id' => $poliUmum->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'waiting',
            'payment_type' => 'bpjs',
        ]);

        // General queues
        Queue::create([
            'queue_number' => 'A-001', 'queue_prefix' => 'A', 'queue_category' => 'umum',
            'poly_id' => $poliUmum->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'done',
            'payment_type' => 'bpjs', 'called_at' => now()->subMinutes(50),
            'completed_at' => now()->subMinutes(40),
        ]);

        Queue::create([
            'queue_number' => 'A-002', 'queue_prefix' => 'A', 'queue_category' => 'umum',
            'poly_id' => $poliUmum->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'serving',
            'payment_type' => 'umum', 'counter_number' => 2,
            'called_at' => now()->subMinutes(5), 'served_at' => now()->subMinutes(3),
        ]);

        foreach (range(3, 8) as $i) {
            Queue::create([
                'queue_number' => "A-" . str_pad($i, 3, '0', STR_PAD_LEFT),
                'queue_prefix' => 'A', 'queue_category' => 'umum',
                'poly_id' => $poliUmum->id,
                'queue_date' => $today, 'source' => 'kiosk', 'status' => 'waiting',
                'payment_type' => $i % 2 === 0 ? 'bpjs' : 'umum',
            ]);
        }

        Queue::create([
            'queue_number' => 'B-001', 'queue_prefix' => 'B', 'queue_category' => 'umum',
            'poly_id' => $poliGigi->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'waiting',
            'payment_type' => 'bpjs',
        ]);

        Queue::create([
            'queue_number' => 'C-001', 'queue_prefix' => 'C', 'queue_category' => 'umum',
            'poly_id' => $poliKia->id,
            'queue_date' => $today, 'source' => 'kiosk', 'status' => 'waiting',
            'payment_type' => 'bpjs',
        ]);
    }
}
