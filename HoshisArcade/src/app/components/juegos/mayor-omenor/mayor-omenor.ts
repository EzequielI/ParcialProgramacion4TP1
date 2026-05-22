import { Component, inject } from '@angular/core';
import { Auth } from '../../../servicios/auth';
import { PuntuacionJuegos } from '../../../servicios/puntuacion-juegos';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-mayor-omenor',
  imports: [RouterLink],
  templateUrl: './mayor-omenor.html',
  styleUrl: './mayor-omenor.css',
})
export class MayorOMenor {


  puntuacionSrv = inject(PuntuacionJuegos);
  private readonly auth = inject(Auth);

  cartas: number[] = [];
  cartaActual: number = 0;
  siguienteCarta: number = 0;
  vidas = 3;
  juegoTerminado = false;
  cartaActualSprite = ""
  estadoJuego = ""


  aciertos = 0;
  intentos = 0;

  jugando = false;
  mensaje = '';

  ngOnInit() {
    this.iniciarJuego();
  }

  inicializarMazo() {
    this.cartas = [];

    for(let i = 0; i < 1000; i++){
      let numero = Math.floor(Math.random() * 12) + 1;

      while(numero === this.cartas[this.cartas.length - 1]){
        numero = Math.floor(Math.random() * 12) + 1;
      }

      this.cartas.push(numero);
    }
  }

  iniciarJuego() {
    this.puntuacionSrv.detenerTiempo()
    this.inicializarMazo();
    
    this.aciertos = 0;
    this.intentos = 0;
    this.mensaje = '';
    this.jugando = true;
    this.vidas = 3;
    this.juegoTerminado = false
    
    this.puntuacionSrv.reiniciarPuntuacion();
    
    this.cartaActual = this.cartas[0];
    this.cambiarSpriteCartas()
  }
  
  jugar(eleccion: 'mayor' | 'menor') {
    this.intentos++;
    
    this.siguienteCarta = this.cartas[this.intentos];
    
    const esMayor = this.siguienteCarta > this.cartaActual;
    
    if (
      (eleccion === 'mayor' && esMayor) ||
      (eleccion === 'menor' && !esMayor)
    ) {
      this.aciertos++;
      this.puntuacionSrv.sumarAcierto();
      this.estadoJuego = "ganar"
      this.mensaje = 'Acertaste';
    } else {
      this.puntuacionSrv.restarError();
      this.vidas--;
      this.estadoJuego = "perder"
      this.mensaje = 'Le erraste';
    }
    
    this.cartaActual = this.siguienteCarta;
    this.cambiarSpriteCartas();
    
    if (this.intentos >= this.cartas.length - 1 || this.vidas == 0) {
      this.finalizarJuego();
    }
  }

  async finalizarJuego() {

    this.juegoTerminado = true
    this.mensaje = `Fin del juego, acertaste: ${this.aciertos} veces`;
    this.subirDatosMayorOMenor()
  }
  async subirDatosMayorOMenor(){
    const correo = await this.puntuacionSrv.traerCorreoUsuario();
    return await  this.auth.clienteSupabase.from('puntajeMayorOMenor').insert([
      {
        nombre : this.puntuacionSrv.obtenerNombreSesion(),
        correo: correo,
        cartasAcertadas: this.aciertos,
        puntaje: this.puntuacionSrv.puntuacion(),
        
      }
    ])
  }
  cambiarSpriteCartas(){
    switch(this.cartaActual){
      case 12:
        this.cartaActualSprite = "SpriteCartas/Carta12.jpg"
        break;
      case 11:
        this.cartaActualSprite = "SpriteCartas/Carta11.JPG"
        break;
      case 10:
        this.cartaActualSprite = "SpriteCartas/Carta10.JPG"
        break;
      case 9:
        this.cartaActualSprite = "SpriteCartas/Carta9.JPG"
        break;
      case 8:
        this.cartaActualSprite = "SpriteCartas/Carta8.JPG"
        break;
      case 7:
        this.cartaActualSprite = "SpriteCartas/Carta7.JPG"
        break;
      case 6:
        this.cartaActualSprite = "SpriteCartas/Carta6.JPG"
        break;
      case 5:
        this.cartaActualSprite = "SpriteCartas/Carta5.JPG"
        break;
      case 4:
        this.cartaActualSprite = "SpriteCartas/Carta4.JPG"
        break;
      case 3:
        this.cartaActualSprite = "SpriteCartas/Carta3.JPG"
        break;
      case 2:
        this.cartaActualSprite = "SpriteCartas/Carta2.JPG"
        break;
      default:
        this.cartaActualSprite = "SpriteCartas/Carta1.JPG"

    }
  }

}
