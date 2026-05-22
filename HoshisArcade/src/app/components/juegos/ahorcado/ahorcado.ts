import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { AhorcadoLogica } from '../../../servicios/ahorcado-logica';
import { RouterLink } from "@angular/router";
import { PuntuacionJuegos } from '../../../servicios/puntuacion-juegos';
import { Auth } from '../../../servicios/auth';

@Component({
  selector: 'app-ahorcado',
  imports: [RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {

  private readonly supabase = inject(AhorcadoLogica);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly auth = inject(Auth)
  readonly puntuacionServicio = inject(PuntuacionJuegos);

  palabraElegida : string = "";
  
  letras : string[] = []

  palabraVisible: string[] = []

  private vidas = 6

  readonly abecedario: string[] = [
    'A','B','C','D','E','F','G',
    'H','I','J','K','L','M','N',
    'Ñ','O','P','Q','R','S','T',
    'U','V','W','X','Y','Z'
  ];

  async ngOnInit() {
    await this.reiniciarJuego();
    this.auth.obtenerUsuarioDatos()
  }
  
  private quitarVida = true;
  private letrasAcertadas = 0;
  readonly letrasPresionadas = signal<string[]>([]);
  private totalLetrasPresionadas = 0
  juegoTerminado: boolean = false;
  estadoJuegoMensaje: string = "";
  colorEstado: string = "";
  vidasJugador = "";

  seleccionarLetra(letra: string) {
    
    this.totalLetrasPresionadas += 1;
    //Se encarga de actualizar y hacer que la tecla se deshabilite
    if (this.letrasPresionadas().includes(letra)) {
      return;
    }
    this.letrasPresionadas.update(letras => [...letras, letra]);

    //Recorrera la palabra para buscar si esta la letra y 
    // en caso de que no restara una vida
    for (let i = 0; i < this.letras.length; i++) {
      
      if (this.letras[i] === letra) {
        this.palabraVisible[i] = letra;
        this.quitarVida = false
        this.letrasAcertadas += 1
        this.puntuacionServicio.sumarAcierto();
      }
      
    }
    if (this.quitarVida == true) {
      this.vidas -= 1;
      this.puntuacionServicio.restarError();
    }
    this.quitarVida = true
    this.estadoJuego()
    this.cambiarSpriteVidas()
  }

  estadoJuego(){
    //Perdiste
    if (this.vidas == 0) {
      this.juegoTerminado = true;
      this.puntuacionServicio.detenerTiempo();
      this.estadoJuegoMensaje = "Perdiste";
      this.colorEstado = "mensajePerder";
      this.supabase.subirDatosAhorcado(this.totalLetrasPresionadas);
    }
    //Ganaste
    if(this.letrasAcertadas == this.palabraElegida.length){
      this.juegoTerminado = true;
      this.puntuacionServicio.detenerTiempo();
      this.estadoJuegoMensaje = "Ganaste!"
      this.colorEstado = "mensajeGanar";
      this.supabase.subirDatosAhorcado(this.totalLetrasPresionadas);
    }
  }
  // Se encargara de cambiar la imagen para mostrar las vidas
  cambiarSpriteVidas(){
    switch(this.vidas){
      case 6:
        this.vidasJugador = "SpriteAhorcado/Ahorcado6Vidas.png"
        break;
      case 5:
        this.vidasJugador = "SpriteAhorcado/Ahorcado5Vidas.png"
        break;
      case 4:
        this.vidasJugador = "SpriteAhorcado/Ahorcado4Vidas.png"
        break;
      case 3:
        this.vidasJugador = "SpriteAhorcado/Ahorcado3Vidas.png"
        break;
      case 2:
        this.vidasJugador = "SpriteAhorcado/Ahorcado2Vidas.png"
        break;
      case 1:
        this.vidasJugador = "SpriteAhorcado/Ahorcado1Vidas.png"
        break;
      default:
        this.vidasJugador = "SpriteAhorcado/Ahorcado0Vidas.png"
    }
  }
  
  async reiniciarJuego(){
    //Trae las palabras
    const palabrasLista = (await this.supabase.traerJuegos()).data;

    //Elige una palabra aleatoria
    this.palabraElegida = palabrasLista?.[
      Math.floor(Math.random() * palabrasLista?.length)
    ].palabra;

    this.letras = this.palabraElegida.toUpperCase().split('');

    this.palabraVisible = Array(this.letras.length).fill('_');

    // Reinicia las vidas
    this.vidas = 6;

    // Reinicia el estado del juego
    this.juegoTerminado = false;

    this.estadoJuegoMensaje = "";

    this.colorEstado = "";

    // Reiniciar lógica interna
    this.quitarVida = true;

    this.letrasAcertadas = 0;

    // Reiniciar letras apretadas
    this.letrasPresionadas.set([]);

    // Reiniciar sprite del ahorcado
    this.cambiarSpriteVidas();

    this.puntuacionServicio.detenerTiempo();

    this.puntuacionServicio.reiniciarPuntuacion();

    this.puntuacionServicio.iniciarTiempo();

    this.cdr.detectChanges();
  }
}
