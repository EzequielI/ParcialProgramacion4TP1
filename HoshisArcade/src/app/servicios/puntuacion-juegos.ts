import { inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class PuntuacionJuegos {

  private readonly auth = inject(Auth)
  private readonly _puntuacion = signal(0);
  readonly puntuacion = this._puntuacion.asReadonly()

  private readonly _tiempoJugado = signal(0)
  readonly tiempoJugado = this._tiempoJugado.asReadonly()

  private intervalo : any;
  
  // Traera el correo del usuario actual
  async traerCorreoUsuario(){
    const {
    data: { user }
    } = await this.auth
    .clienteSupabase
    .auth
    .getUser();

  return user?.email ?? "";
  }

  // Traera el nombre del usuario actual
  obtenerNombreSesion(){
    return this.auth.nombreSesionActual();

  } 

  // Inicia el tiempo y empieza a restar puntos de la puntuacion
  iniciarTiempo(){
    this.intervalo = setInterval(() => {

        this._tiempoJugado.update(valor => valor + 1);

      this._puntuacion.update(valor => {

        const nuevoValor = valor - 10;

        return nuevoValor < 0 ? 0 : nuevoValor;
      });

    }, 1000);
  }

  // Para el contador
  detenerTiempo(){
    clearInterval(this.intervalo);
  }

  // Cuando se acierte en algun juego esto sumara
  sumarAcierto(){
    this._puntuacion.update(valor => valor + 200);

  }

  // Cuando haya algun error en un juego esto restara
  restarError(){
    this._puntuacion.update(valor => {

      const nuevoValor = valor - 100;

      return nuevoValor < 0 ? 0 : nuevoValor;
    });

  }

  // Esto reiniciara a 0 la puntuacion
  reiniciarPuntuacion(){
    this._puntuacion.set(0);

  }
}
