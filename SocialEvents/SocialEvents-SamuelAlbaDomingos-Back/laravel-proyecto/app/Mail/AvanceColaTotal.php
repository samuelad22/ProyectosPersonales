<?php

namespace App\Mail;

use App\Models\Evento;
use App\Models\Inscripcion;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AvanceColaTotal extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Inscripcion $inscripcion,
        public Evento $evento,
        public User $usuario
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Entrasteis todos en ' . $this->evento->nombre . '!',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
           htmlString: "
            <h1>¡Felicidades, entrasteis todos!</h1>
            <p>Se ha podido dejar suficiente espacio para que tu grupo pueda asistir
            al completo, a pasarlo guay!!</p>
        "
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
