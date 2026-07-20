<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificacionNuevoMensaje
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    public function __construct(public int $conversacion_id, public int $enviado_por)
    {
        
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversacion.' . $this->conversacion_id),
        ];
    }
    public function broadcastAs(){
        return 'NotificacionMensaje';
    }
    public function broadcastWith(){
        return [
        'conversacion_id' => $this->conversacion_id,
        'leido_por' => $this->enviado_por,
    ];
    }
}
