import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { AhorcadoLogica } from '../../../servicios/ahorcado-logica';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-ahorcado',
  imports: [RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {

  private readonly supabase = inject(AhorcadoLogica);
  private readonly cdr = inject(ChangeDetectorRef)

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
  }
  
  private quitarVida = true;
  private letrasAcertadas = 0;
  readonly letrasPresionadas = signal<string[]>([]);
  juegoTerminado: boolean = false;
  estadoJuegoMensaje: string = "";
  colorEstado: string = "";
  spritesAhorcado: string[] = ['Ahorcado0Vidas.png',
    'Ahorcado1Vidas.png',
    'Ahorcado2Vidas.png',
    'Ahorcado3Vidas.png',
    'Ahorcado4Vidas.png',
    'Ahorcado5Vidas.png',
    'Ahorcado6Vidas.png',
  ];
  vidasJugador = "";

  seleccionarLetra(letra: string) {
    
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
      }
      
    }
    if (this.quitarVida == true) {
      this.vidas -= 1;
    }
    this.quitarVida = true
    this.estadoJuego()
    this.cambiarSpriteVidas()
  }

  estadoJuego(){
    //Perdiste
    if (this.vidas == 0) {
      this.juegoTerminado = true;
      this.estadoJuegoMensaje = "Perdiste";
      this.colorEstado = "mensajePerder";
    }
    //Ganaste
    if(this.letrasAcertadas == this.palabraElegida.length){
      this.juegoTerminado = true;
      this.estadoJuegoMensaje = "Ganaste!"
      this.colorEstado = "mensajeGanar";
    }
  }
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

    const palabrasLista = (await this.supabase.traerJuegos()).data;

    this.palabraElegida = palabrasLista?.[
      Math.floor(Math.random() * palabrasLista?.length)
    ].palabra;

    this.letras = this.palabraElegida.toUpperCase().split('');

    this.palabraVisible = Array(this.letras.length).fill('_');

    // Reiniciar vidas
    this.vidas = 6;

    // Reiniciar estados
    this.juegoTerminado = false;

    this.estadoJuegoMensaje = "";

    this.colorEstado = "";

    // Reiniciar lógica interna
    this.quitarVida = true;

    this.letrasAcertadas = 0;

    // Reiniciar letras usadas
    this.letrasPresionadas.set([]);

    // Reiniciar sprite
    this.cambiarSpriteVidas();

    this.cdr.detectChanges();
  }
}
