<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Registro extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public User $user)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(subject: '¡Bienvenido a SocialEvents!');

    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(htmlString: "
            <h1>¡Bienvenido a SocialEvents!</h1>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <p>Ya puedes explorar eventos de freestyle, graffiti y deportes urbanos cerca de ti.</p>
            <p>Si no has creado esta cuenta, ignora este mensaje.</p>
            
        ");
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
