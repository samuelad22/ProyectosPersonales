<?php

namespace App\Mail;

use App\Models\Evento;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Attachment;
use Barryvdh\DomPDF\Facade\Pdf;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class ConfirmacionInscripcion extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Evento $evento,
        public User $usuario,
        public string $qrToken,
        public int $acompanantes
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎟️ Tu entrada para ' . $this->evento->nombre,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: '
                <h2>¡Inscripción confirmada!</h2>
                <p>Hola <strong>' . $this->usuario->nombreUsuario . '</strong>,</p>
                <p>Tu entrada para <strong>' . $this->evento->nombre . '</strong> está adjunta en este correo.</p>
                <p>Muestra el código QR en la entrada del evento.</p>
            '
        );
    }

    public function attachments(): array
    {
        // Generar QR en base64
        $renderer = new ImageRenderer(
            new RendererStyle(200),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $qrSvg = $writer->writeString($this->qrToken);
        $qrBase64Svg = base64_encode($qrSvg);

        // Generar HTML del PDF
        $html = view('pdf.entrada-pdf', [
            'evento' => $this->evento,
            'usuario' => $this->usuario,
            'qrSvg' => $qrBase64Svg,
            'acompanantes' => $this->acompanantes,
            'qrToken' => $this->qrToken,
        ])->render();

        $pdf = Pdf::loadHTML($html);

        return [
            Attachment::fromData(
                fn() => $pdf->output(),
                'entrada-' . $this->evento->slug . '.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
