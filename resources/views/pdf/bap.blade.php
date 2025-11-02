<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Berita Acara Pekerjaan - {{ $ticket_number }}</title>
    <style>
        @page {
            margin: 10mm 15mm;
            size: A4;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 8.5pt;
            line-height: 1.3;
            color: #000;
            margin: 0;
            padding: 0;
        }

        .page-container {
            padding: 0;
            box-sizing: border-box;
        }

        .header {
            text-align: center;
            margin-bottom: 8px;
            position: relative;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            min-height: 45px;
        }

        .header h1 {
            font-size: 14pt;
            font-weight: bold;
            margin: 0;
            padding: 0;
            letter-spacing: 0.5px;
            padding-top: 5px;
        }

        .logo {
            position: absolute;
            right: 0;
            top: -15px;
            width: 55px;
            height: auto;
        }

        .form-row {
            display: table;
            width: 100%;
            margin-bottom: 6px;
        }

        .form-col {
            display: table-cell;
            vertical-align: middle;
            padding: 0 5px 0 0;
        }

        .form-col-50 {
            width: 50%;
        }

        .form-label {
            font-weight: bold;
            font-size: 8.5pt;
            display: inline-block;
            min-width: 110px;
        }

        .form-label sup {
            font-size: 6.5pt;
        }

        .form-input {
            border: 1px solid #000;
            min-height: 22px;
            padding: 3px 4px;
            display: inline-block;
            width: 200px;
            vertical-align: middle;
            font-size: 8.5pt;
            box-sizing: border-box;
            text-decoration: none;
        }

        .hint-text {
            font-size: 6.5pt;
            color: #666;
            font-style: italic;
            display: block;
            margin-top: 0px;
            margin-left: 115px;
        }

        .section-title {
            font-weight: bold;
            font-size: 9pt;
            margin: 6px 0 4px 0;
            text-decoration: underline;
        }

        .checkbox-line {
            margin: 3px 0;
            font-size: 8.5pt;
        }

        .checkbox {
            display: inline-block;
            margin-right: 6px;
            white-space: nowrap;
        }

        .checkbox sup {
            font-size: 6.5pt;
        }

        .checkbox-box {
            display: inline-block;
            width: 9px;
            height: 9px;
            border: 1px solid #000;
            margin-right: 2px;
            vertical-align: middle;
            position: relative;
        }

        .checkbox-box.checked::after {
            content: 'X';
            position: absolute;
            top: -3px;
            left: 1px;
            font-size: 7.5pt;
            font-weight: bold;
        }

        .textarea-box {
            border: 1px solid #000;
            min-height: 60px;
            padding: 4px;
            margin: 3px 0;
            width: 100%;
            box-sizing: border-box;
            font-size: 8.5pt;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 5px 0;
        }

        table th, table td {
            border: 1px solid #000;
            padding: 3px;
            text-align: left;
            font-size: 7.5pt;
        }

        table th {
            background-color: #d0d0d0;
            font-weight: bold;
            text-align: center;
        }

        .disclaimer {
            font-size: 7.5pt;
            margin: 6px 0;
            line-height: 1.3;
        }

        .disclaimer sup {
            font-size: 6.5pt;
        }

        .signature-section {
            margin-top: 8px;
            display: table;
            width: 100%;
        }

        .signature-box {
            display: table-cell;
            width: 50%;
            text-align: left;
            vertical-align: top;
            padding: 0 8px;
        }

        .signature-title {
            font-weight: bold;
            font-size: 8.5pt;
            margin-bottom: 4px;
        }

        .signature-area {
            border: 1px solid #000;
            min-height: 60px;
            margin: 4px 0;
            position: relative;
            background: #fff;
        }

        .signature-image {
            max-width: 100%;
            max-height: 55px;
            margin: 2px auto;
            display: block;
        }

        .name-line {
            margin-top: 3px;
            font-weight: normal;
            font-size: 8.5pt;
            text-align: left;
        }
    </style>
</head>
<body>
<div class="page-container">
    <!-- Header -->
    <div class="header">
        <h1>BERITA ACARA PEKERJAAN</h1>
        <div class="logo">
            @php
                $logoPath = public_path('images/hp-logo.png');
                $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
                $logoSrc = $logoData ? 'data:image/png;base64,' . $logoData : '';
            @endphp
            @if($logoSrc)
                <img src="{{ $logoSrc }}" alt="HP Logo" style="width: 55px; height: auto;">
            @endif
        </div>
    </div>

    <!-- Kode BA & Tanggal Visit -->
    <div class="form-row">
        <div class="form-col form-col-50">
            <span class="form-label">Kode BA<sup>1)</sup></span>
            <span class="form-input">{{ $bap_code }}</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">Tanggal Visit</span>
            <span class="form-input">{{ $visit_date }}</span>
        </div>
    </div>
    <div class="form-row">
        <div class="form-col form-col-50">
        </div>
        <div class="form-col form-col-50">
            <div class="hint-text" style="margin-left: 0px; margin-top: -3px; padding-left: 0;">
                (DD/MM/YYYY Contoh: 15/02/2020, 02/01/2020)
            </div>
        </div>
    </div>

    <!-- No Tiket HP & Jam Visit -->
    <div class="form-row">
        <div class="form-col form-col-50">
            <span class="form-label">No Tiket HP</span>
            <span class="form-input">{{ $ticket_number }}</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">Jam Visit</span>
            <span class="form-input">{{ $visit_time }}</span>
        </div>
    </div>
    <div class="form-row">
        <div class="form-col form-col-50">
        </div>
        <div class="form-col form-col-50">
            <div class="hint-text" style="margin-left: 0px; margin-top: -3px; padding-left: 0;">
                (HH:MM (24 Jam) Contoh: 09:30 WIB, 13:25 WITA, 14:20 WIT)
            </div>
        </div>
    </div>

    <!-- Case Details -->
    <div class="section-title">Case Details</div>

    <!-- Serial Number & Product Number -->
    <div class="form-row">
        <div class="form-col form-col-50">
            <span class="form-label">Serial Number</span>
            <span class="form-input">{{ $serial_number }}</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">Product Number</span>
            <span class="form-input">{{ $product_number }}</span>
        </div>
    </div>

    <!-- Tipe Unit -->
    <div class="checkbox-line">
        <span class="form-label">Tipe Unit<sup>2)</sup></span>
        <span class="checkbox"><span class="checkbox-box"></span> Desktop</span>
        <span class="checkbox"><span class="checkbox-box {{ $unit_type === 'Laptop' ? 'checked' : '' }}"></span>Laptop</span>
        <span class="checkbox"><span class="checkbox-box"></span> Printer</span>
        <span class="checkbox"><span class="checkbox-box"></span> Projector</span>
        <span class="checkbox"><span class="checkbox-box"></span> Scanner</span>
        <span class="checkbox"><span class="checkbox-box"></span> Monitor _________________________</span>
    </div>

    <!-- Kategori -->
    <div class="checkbox-line">
        <span class="form-label">Kategori<sup>2)</sup></span>
        <span class="checkbox"><span class="checkbox-box {{ $category === 'Incident' ? 'checked' : '' }}"></span> Incident</span>
        <span class="checkbox"><span class="checkbox-box {{ $category === 'Request' ? 'checked' : '' }}"></span> Request</span>
    </div>

    <!-- Scope -->
    <div class="checkbox-line">
        <span class="form-label">Scope<sup>2)</sup></span>
        <span class="checkbox"><span class="checkbox-box {{ $scope === 'Maintenance Support' ? 'checked' : '' }}"></span> Maintenance Support</span>
        <span class="checkbox"><span class="checkbox-box {{ $scope === 'Void' ? 'checked' : '' }}"></span> Void</span>
        <span class="checkbox"><span class="checkbox-box {{ $scope === 'Out of Scope' ? 'checked' : '' }}"></span> Out of Scope</span>
    </div>

    <!-- Product Warranty -->
    <div class="checkbox-line">
        <span class="form-label">Product Warranty<sup>2)</sup></span>
        <span class="checkbox"><span class="checkbox-box {{ $warranty_status === 'Warranty' ? 'checked' : '' }}"></span> Warranty</span>
        <span class="checkbox"><span class="checkbox-box {{ $warranty_status === 'Out of Warranty' ? 'checked' : '' }}"></span> Out of Warranty</span>
    </div>

    <!-- Case Description -->
    <div style="margin: 6px 0;">
        <div class="form-label" style="display: block; margin-bottom: 3px;">Case Description</div>
        <div class="textarea-box">{{ $case_description }}</div>
    </div>

    <!-- Informasi User -->
    <div class="section-title">Informasi User</div>

    <!-- Nama User & Perusahaan -->
    <div class="form-row">
        <div class="form-col form-col-50">
            <span class="form-label">Nama User</span>
            <span class="form-input">@if($user_name){{ $user_name }}@endif</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">Perusahaan</span>
            <span class="form-input">@if($company ?? false){{ $company }}@endif</span>
        </div>
    </div>

    <!-- ID User & No. Telp -->
    <div class="form-row">
        <div class="form-col form-col-50">
            <span class="form-label">ID User</span>
            <span class="form-input">@if($user_id_number ?? false){{ $user_id_number }}@endif</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">No. Telp</span>
            <span class="form-input">@if($user_phone ?? false){{ $user_phone }}@endif</span>
        </div>
    </div>

    <!-- Lokasi & Alamat E-mail -->
    <div class="form-row">
        <div class="form-col form-col-50">
            <span class="form-label">Lokasi</span>
            <span class="form-input">@if($location ?? false){{ $location }}@endif</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">Alamat E-mail</span>
            <span class="form-input">@if($user_email ?? false){{ $user_email }}@endif</span>
        </div>
    </div>

    <!-- Catatan Pekerjaan dan Solusi -->
    <div class="section-title">Catatan pekerjaan dan Solusi</div>
    <div class="textarea-box" style="min-height: 70px;">{{ $work_notes }}</div>

    <!-- Kategori Solusi -->
    <div class="checkbox-line" style="margin-top: 12px;">
        <span class="form-label">Kategori Solusi<sup>3)</sup></span>
        <span class="checkbox"><span class="checkbox-box"></span>Repair</span>
        <span class="checkbox"><span class="checkbox-box "></span>Re/Install</span>
        <span class="checkbox"><span class="checkbox-box "></span>Reimage</span>
        <span class="checkbox"><span class="checkbox-box "></span>Pemindahan Data</span>
        <span class="checkbox"><span class="checkbox-box "></span> Other______________________</span>
    </div>

    <!-- Replace Parts -->
    <div style="margin: 6px 0;">
        <div style="font-weight: bold; margin-bottom: 3px; font-size: 8.5pt;">
            <span class="checkbox-box {{ count($replaced_parts) > 0 ? 'checked' : '' }}"></span> Replace, Isi dibawah ini:
        </div>
        <table>
            <thead>
                <tr>
                    <th style="width: 10%;">Quantity</th>
                    <th style="width: 30%;">Deskripsi Unit / Part</th>
                    <th style="width: 30%;">Product/Part Number Pengganti</th>
                    <th style="width: 30%;">S/N (CT Code) Pengganti</th>
                </tr>
            </thead>
            <tbody>
                @if(count($replaced_parts) > 0)
                    @foreach($replaced_parts as $part)
                    <tr>
                        <td style="text-align: center;">{{ $part['quantity'] ?? '1' }}</td>
                        <td>{{ $part['description'] ?? '' }}</td>
                        <td>{{ $part['part_number'] ?? '' }}</td>
                        <td>{{ $part['serial_number'] ?? '' }}</td>
                    </tr>
                    @endforeach
                    @if(count($replaced_parts) < 2)
                    @for($i = count($replaced_parts); $i < 2; $i++)
                    <tr>
                        <td style="height: 22px;">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    @endfor
                    @endif
                @else
                    <tr>
                        <td style="height: 22px;">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="height: 22px;">&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                @endif
            </tbody>
        </table>
    </div>

    <!-- Tanggal Resolved & Jam Resolved -->
    <div class="form-row" style="margin-top: 12px;">
        <div class="form-col form-col-50">
            <span class="form-label">Tanggal Resolved</span>
            <span class="form-input">{{ $resolved_date }}</span>
        </div>
        <div class="form-col form-col-50">
            <span class="form-label">Jam Resolved</span>
            <span class="form-input">{{ $resolved_time }}</span>
        </div>
    </div>
    <div class="form-row">
        <div class="form-col form-col-50">
            <div class="hint-text" style="margin-left: 0px; margin-top: -3px; padding-left: 0;">
                (DD/MM/YYYY Contoh: 15/02/2020, 02/01/2020)
            </div>
        </div>
        <div class="form-col form-col-50">
            <div class="hint-text" style="margin-left: 0px; margin-top: -3px; padding-left: 0;">
                (HH:MM (24 Jam) Contoh: 09:30 WIB, 13:25 WITA, 14:20 WIT)
            </div>
        </div>
    </div>

    <!-- Disclaimer -->
    <div class="disclaimer">
        Dengan ini saya mengakui bahwa informasi di atas adalah benar dan<sup>4)</sup> bahwa pihak <b>HP</b> tidak bertanggung jawab atas kehilangan / kerusakan data setelah Berita Acara ini ditandatangani.
    </div>

    <!-- Signature Section -->
    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-title">Tanda Tangan User</div>
            <div class="signature-area">
                @if($user_signature)
                    <img src="{{ $user_signature }}" alt="User Signature" class="signature-image">
                @endif
            </div>
            <div class="name-line">
                <b>Nama :</b> {{ $user_name }}
            </div>
        </div>
        <div class="signature-box">
            <div class="signature-title">Tanda Tangan Engineer</div>
            <div class="signature-area">
                @if($engineer_signature)
                    <img src="{{ $engineer_signature }}" alt="Engineer Signature" class="signature-image">
                @endif
            </div>
            <div class="name-line">
                <b>Nama :</b> {{ $engineer_name }}
            </div>
        </div>
    </div>
</div>
</body>
</html>
