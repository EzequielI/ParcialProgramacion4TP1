import { inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { Mensaje } from '../modelos/mensajes/mensajeModelo';

@Injectable({
  providedIn: 'root',
})
export class Chat {

  private readonly supabase = inject(Auth)
  private readonly _mensajes = signal<Mensaje[]>([]);
  readonly mensajes = this._mensajes.asReadonly();

  private readonly yaEjecutado = signal(false);

  constructor(){
  }

  async cargarMensajes(){
    const {data} = await this.supabase.clienteSupabase
    .from('chatMensajes')
    .select('*, usuarios(nombre)' )
    .order('created_at', {ascending: true});
    
    
    if(data) {
      const nombreActual = this.supabase.nombreSesionActual();
      const mensajesFormateados = data.map((mensaje: any) => ({
        ...mensaje,
        mensajePropio: mensaje.usuarios.nombre === nombreActual
      }));
      this._mensajes.set(mensajesFormateados as Mensaje[])}
  }

  escucharMensajes(){
    if (this.yaEjecutado() == false) {
      this.supabase.clienteSupabase.channel('sala-de-chat')
      .on('postgres_changes', {event: 'INSERT', schema: 'public', table: 'chatMensajes'},
        (payload) => {
          this.cargarMensajes();
        }).subscribe();
        this.yaEjecutado.set(true);
    }
  }

  async enviarMensaje(contenido : string, nombre: string){
    const {data: usuarios} = await this.supabase.clienteSupabase
    .from('usuarios')
    .select('id')
    .eq('nombre', nombre);
    let idUsuario: number

    if (!usuarios || usuarios.length === 0) return;

    idUsuario = usuarios[0].id;

    if (idUsuario) {
      await this.supabase.clienteSupabase.from('chatMensajes').insert({
        contenido,idUsuario
      }
    );
    }
  }
}
