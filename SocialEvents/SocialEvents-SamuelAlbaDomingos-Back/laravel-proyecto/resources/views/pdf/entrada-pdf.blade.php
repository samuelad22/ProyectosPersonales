<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            background: #0d0d1a;
            color: #ffffff;
            margin: 0;
            padding: 30px;
        }
        .ticket {
            border: 2px solid #00eaff;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            margin: 0 auto;
            background: #111111;
        }
        .titulo {
            font-size: 24px;
            color: #00eaff;
            margin-bottom: 4px;
        }
        .subtitulo {
            color: #aa44ff;
            font-size: 13px;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .fila {
            border-bottom: 1px solid #333;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
        }
        .label { color: #b5b5b5; font-size: 12px; }
        .valor { font-weight: bold; font-size: 14px; }
        .qr-section {
            text-align: center;
            margin-top: 24px;
            padding-top: 20px;
            border-top: 2px dashed #333;
        }
        .qr-section img { width: 250px; height: 250px; }
        
    </style>
</head>
<body>
    <div class="ticket">
        <div class="titulo">🎟️ {{ $evento->nombre }}</div>
        <div class="subtitulo">StreetConnect — Entrada oficial</div>

        <div class="fila">
            <span class="label">Asistente</span>
            <span class="valor">{{ $usuario->nombreUsuario }}</span>
        </div>
        <div class="fila">
            <span class="label">Categoría</span>
            <span class="valor">{{ $evento->categoria->nombre }}</span>
        </div>
        <div class="fila">
            <span class="label">Ubicación</span>
            <span class="valor">{{ $evento->ubicacion }}</span>
        </div>
        <div class="fila">
            <span class="label">Fecha</span>
            <span class="valor">{{ $evento->fechaInicio }} — {{ \Carbon\Carbon::parse($evento->horaInicio)->format('H:i') }}</span>
        </div>
        <div class="fila">
            <span class="label">Acompañantes</span>
            <span class="valor">{{ $acompanantes }}</span>
        </div>
        <div class="fila">
            <span class="label">Precio pagado</span>
            <span class="valor">{{ number_format($evento->precio * ($acompanantes + 1), 2, ',', '.') }} €</span>
        </div>

        <div class="qr-section">
            <img src="data:image/png;base64,{{ $qrSvg }}" alt="QR Entrada">
            
        </div>
    </div>
</body>
</html>