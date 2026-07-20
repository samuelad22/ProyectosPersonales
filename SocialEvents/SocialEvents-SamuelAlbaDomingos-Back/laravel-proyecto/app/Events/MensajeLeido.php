<?php 
namespace App\Events;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MensajeLeido implements ShouldBroadcastNow{

    use Dispatchable, SerializesModels;
    public function __construct(public int $conversacion_id, public int $leido_por){}
    public function broadcastOn(){
        return [
    new PrivateChannel('conversacion.' . $this->conversacion_id),
];
    }
    public function broadcastAs(){
        return 'MensajeLeido';
    }
    public function broadcastWith(){
        return [
        'conversacion_id' => $this->conversacion_id,
        'leido_por' => $this->leido_por,
    ];
    }

}
