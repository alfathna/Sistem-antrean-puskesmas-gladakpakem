<?php

namespace App\Http\Controllers;

use App\Models\BpjsLog;
use App\Models\Patient;
use Illuminate\Http\Request;

class BpjsController extends Controller
{
    /**
     * Check BPJS membership status (stub/mock)
     */
    public function checkPeserta(Request $request)
    {
        $validated = $request->validate([
            'bpjs_number' => 'required|string',
        ]);

        $bpjsNumber = $validated['bpjs_number'];

        // Check if patient exists in our DB with this BPJS number
        $patient = Patient::where('bpjs_number', $bpjsNumber)->first();

        // Mock BPJS response (in production, call PCare API)
        $mockResponse = [
            'noKartu' => $bpjsNumber,
            'nama' => $patient?->name ?? 'PESERTA BPJS',
            'hubunganKeluarga' => 'Peserta',
            'sex' => $patient?->gender ?? 'L',
            'tglLahir' => $patient?->birth_date?->format('Y-m-d') ?? '1990-01-01',
            'tglMulaiAktif' => '2014-01-01',
            'tglAkhirBerlaku' => '2099-12-31',
            'kdProviderPst' => [
                'kdProvider' => '0901R001',
                'nmProvider' => 'PUSKESMAS GLADAK PAKEM',
            ],
            'jnsKelas' => ['nama' => $patient?->bpjs_class ? 'Kelas ' . $patient->bpjs_class : 'Kelas III'],
            'jnsPeserta' => ['nama' => $patient?->bpjs_type ?? 'PBI'],
            'aktif' => $patient?->is_bpjs_active ?? true,
        ];

        // Log the BPJS call
        BpjsLog::create([
            'patient_id' => $patient?->id,
            'action_type' => 'check_peserta',
            'api_endpoint' => "/peserta/{$bpjsNumber}",
            'http_method' => 'GET',
            'response_body' => $mockResponse,
            'status_code' => 200,
            'is_success' => true,
            'user_id' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $mockResponse,
        ]);
    }

    /**
     * Bridge registration to BPJS PCare (stub/mock)
     */
    public function bridgePendaftaran(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'bpjs_number' => 'required|string',
            'poly_code' => 'nullable|string',
        ]);

        // Mock response
        $mockResponse = [
            'noUrut' => str_pad(rand(1, 100), 3, '0', STR_PAD_LEFT),
            'message' => 'OK',
        ];

        BpjsLog::create([
            'action_type' => 'pendaftaran',
            'api_endpoint' => '/pendaftaran',
            'http_method' => 'POST',
            'request_body' => $validated,
            'response_body' => $mockResponse,
            'status_code' => 200,
            'is_success' => true,
            'user_id' => auth()->id(),
        ]);

        // Update registration
        $registration = \App\Models\Registration::findOrFail($validated['registration_id']);
        $registration->update([
            'bpjs_verified' => true,
            'bpjs_verification_time' => now(),
            'bpjs_status' => 'aktif',
            'bpjs_bridged' => true,
            'bpjs_visit_id' => 'VISIT-' . now()->format('YmdHis'),
            'bpjs_bridge_time' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $mockResponse,
            'message' => 'Pendaftaran BPJS berhasil (mock)',
        ]);
    }
}
