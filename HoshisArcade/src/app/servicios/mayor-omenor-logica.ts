import { inject, Injectable, signal } from '@angular/core';
import { PuntuacionJuegos } from './puntuacion-juegos';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class MayorOmenor {

  
  readonly puntuacionServicio = inject(PuntuacionJuegos);
  private readonly auth = inject(Auth);

  private readonly _cartas = signal<number[]>([]);
  readonly cartas = this._cartas.asReadonly();

  private readonly _cartaActual = signal(0);
  readonly cartaActual = this._cartaActual.asReadonly();

  private readonly _siguienteCarta = signal(0);
  readonly siguienteCarta = this._siguienteCarta.asReadonly();

  private readonly _vidas = signal(3);
  readonly vidas = this._vidas.asReadonly()

  private readonly _juegoTerminado = signal(false);
  readonly juegoTerminado = this._juegoTerminado.asReadonly();

  private readonly _cartaActualSprite = signal("")
  readonly cartaActualSprite = this._cartaActualSprite.asReadonly();

  private readonly _estadoJuego = signal("")
  readonly estadoJuego = this._estadoJuego.asReadonly();

  private readonly _aciertos = signal(0);
  readonly aciertos = this._aciertos.asReadonly();

  private readonly _intentos = signal(0);
  readonly intentos = this._intentos.asReadonly();

  private readonly _jugando = signal(false);
  readonly jugando = this._jugando.asReadonly();

  private readonly _mensaje = signal('');
  readonly mensaje = this._mensaje.asReadonly();


  //Iniciar mazo de cartas
  inicializarMazo() {
    const mazo: number[] = [];

    for(let i = 0; i < 1000; i++){
      let numero = Math.floor(Math.random() * 12) + 1;

      while(numero === mazo[mazo.length - 1]){
        numero = Math.floor(Math.random() * 12) + 1;
      }

      mazo.push(numero);
    }
    this._cartas.set(mazo)
  }

  //Inicializar variables
  iniciarJuego() {
    this.puntuacionServicio.detenerTiempo()
    this.inicializarMazo();
    
    this._aciertos.set(0);
    this._intentos.set (0);
    this._mensaje.set('');
    this._jugando.set(true);
    this._vidas.set(3);
    this._juegoTerminado.set(false);
    
    this.puntuacionServicio.reiniciarPuntuacion();
    
    this._cartaActual.set(this.cartas()[0]);
    this.cambiarSpriteCartas()
  }
  
  //Eleccion hecha a partir del tocar el boton
  jugar(eleccion: 'mayor' | 'menor') {
    this._intentos.update(v => v + 1);
    
    this._siguienteCarta.set( this._cartas()[this._intentos()]);
    
    const esMayor = this.siguienteCarta() > this.cartaActual();
    
    if (
      (eleccion === 'mayor' && esMayor) ||
      (eleccion === 'menor' && !esMayor)
    ) {
      this._aciertos.update(v => v + 1);
      this.puntuacionServicio.sumarAcierto();
      this._estadoJuego.set("ganar");
      this._mensaje.set("Acertaste");
    } else {
      this.puntuacionServicio.restarError();

      this._vidas.update(v => v - 1);
      this._estadoJuego.set("perder");
      this._mensaje.set("Le erraste");
    }
    
    this._cartaActual.set(this.siguienteCarta());

    this.cambiarSpriteCartas();
    
    if (this.intentos() >= this.cartas().length - 1 || this.vidas() <= 0) {
      this.finalizarJuego();
    }
  }

  //Finalizara el juego
  async finalizarJuego() {

    this._juegoTerminado.set(true);
    this._mensaje.set(`Fin del juego, acertaste: ${this.aciertos()} veces`);
    this.subirDatosMayorOMenor()
  }
  async subirDatosMayorOMenor(){
    const correo = await this.puntuacionServicio.traerCorreoUsuario();
    return await  this.auth.clienteSupabase.from('puntajeMayorOMenor').insert([
      {
        nombre : this.puntuacionServicio.obtenerNombreSesion(),
        correo: correo,
        cartasAcertadas: this.aciertos(),
        puntaje: this.puntuacionServicio.puntuacion(),
        
      }
    ])
  }
  //Cambiara el sprite de las cartas cuando es necesario
  cambiarSpriteCartas(){
    this._cartaActualSprite.set(
      `SpriteCartas/Carta${this._cartaActual()}.JPG`
    );
  }

}
