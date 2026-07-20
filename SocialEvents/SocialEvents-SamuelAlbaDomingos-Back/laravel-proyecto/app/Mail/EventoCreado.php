<?php

namespace App\Mail;

use App\Models\Evento;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventoCreado extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public Evento $evento)
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tu evento se ha creado correctamente',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(htmlString:"
        <h1>Nuevo evento: {$this->evento->nombre}</h1>
        <p>Hola, tu evento ha sido creador satisfactoriamente, aqui tienes algunos datos sobre él:</p>
        <p>Nombre: {$this->evento->nombre}</p>
        <p>Fecha Inicio: {$this->evento->fechaInicio} - {$this->evento->horaInicio}</p>
        <p>Categoria: {$this->evento->categoria->nombre}</p>
        <p>Descripcion: {$this->evento->descripcion}</p>
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
