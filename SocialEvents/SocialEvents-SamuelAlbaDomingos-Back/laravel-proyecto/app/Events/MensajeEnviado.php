<?php
namespace App\Events;
use App\Http\Resources\MensajeResource;
use App\Models\Mensaje;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
class MensajeEnviado implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Mensaje $mensaje)
    {
    }

    public function broadcastOn(): array
    {
        $destinatarios = DB::table('conversacion_usuario')
            ->where('conversacion_id', $this->mensaje->conversacion_id)
            ->where('user_id', '!=', $this->mensaje->remitente_id)
            ->pluck('user_id');

        $canales = [
            new PrivateChannel('conversacion.' . $this->mensaje->conversacion_id),
        ];

        foreach ($destinatarios as $userId) {
            $canales[] = new PrivateChannel('usuario.' . $userId);
        }

        return $canales;
    }
    public function broadcastAs(): string
    {
        return 'MensajeEnviado';
    }

    public function broadcastWith(): array
    {
        return (new MensajeResource($this->mensaje))->resolve();
    }
}