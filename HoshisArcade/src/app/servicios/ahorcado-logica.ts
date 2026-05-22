import { inject, Injectable } from '@angular/core';
import { Auth } from './auth';
import { PuntuacionJuegos } from './puntuacion-juegos';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoLogica {
    private readonly supabaseConexion = inject(Auth)
    private readonly puntuacionJuegos = inject(PuntuacionJuegos)


  constructor(){}

  async traerJuegos(){
    return await this.supabaseConexion.clienteSupabase.from('palabras').select("*")
  }

  async subirDatosAhorcado(letrasPresionadas:number){
    const correo = await this.puntuacionJuegos.traerCorreoUsuario();

    return await this.supabaseConexion
      .clienteSupabase
      .from('puntajeAhorcado')
      .insert([
        {
          nombre: this.puntuacionJuegos.obtenerNombreSesion(),

          correo: correo,

          letrasSeleccionadas: letrasPresionadas,

          tiempo: this.puntuacionJuegos.tiempoJugado(),

          puntaje: this.puntuacionJuegos.puntuacion()
        }
      ]);
  }
}
