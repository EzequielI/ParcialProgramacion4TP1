import { inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class PuntuacionJuegos {

  private readonly auth = inject(Auth)
  puntuacion = signal(0);
  tiempoJugado = signal(0)
  private intervalo : any;
  constructor(){}
  
  async traerCorreoUsuario(){
    const {
    data: { user }
    } = await this.auth
    .clienteSupabase
    .auth
    .getUser();

  return user?.email ?? "";
  }

  obtenerNombreSesion(){
    return this.auth.nombreSesionActual();

  } 

  iniciarTiempo(){
    this.intervalo = setInterval(() => {

        this.tiempoJugado.update(valor => valor + 1);

      this.puntuacion.update(valor => {

        const nuevoValor = valor - 10;

        return nuevoValor < 0 ? 0 : nuevoValor;
      });

    }, 1000);
  }

  detenerTiempo(){
    clearInterval(this.intervalo);
  }

  sumarAcierto(){
    this.puntuacion.update(valor => valor + 200);

  }

  restarError(){
    this.puntuacion.update(valor => {

      const nuevoValor = valor - 100;

      return nuevoValor < 0 ? 0 : nuevoValor;
    });

  }

  reiniciarPuntuacion(){
    this.puntuacion.set(0);

  }
}
