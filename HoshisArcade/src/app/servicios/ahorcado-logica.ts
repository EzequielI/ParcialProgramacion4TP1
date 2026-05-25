import { inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { PuntuacionJuegos } from './puntuacion-juegos';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoLogica {
  private readonly supabaseConexion = inject(Auth);
  readonly puntuacionJuegos = inject(PuntuacionJuegos);

  private readonly palabraElegida = signal("");

  private readonly letras = signal<string[]>([]);

  private readonly _palabraVisible = signal<string[]>([]);
  readonly palabraVisible = this._palabraVisible.asReadonly();

  private readonly vidas = signal(6);

  private readonly _juegoTerminado = signal(false);
  readonly juegoTerminado = this._juegoTerminado.asReadonly();

  private readonly _estadoJuegoMensaje = signal("");
  readonly estadoJuegoMensaje = this._estadoJuegoMensaje.asReadonly();

  private readonly _colorEstado = signal("");
  readonly colorEstado = this._colorEstado.asReadonly();

  private readonly _vidasJugador = signal("");
  readonly vidasJugador = this._vidasJugador.asReadonly();

  private readonly _letrasPresionadas = signal<string[]>([]);
  readonly letrasPresionadas = this._letrasPresionadas.asReadonly();

  private readonly letrasAcertadas = signal(0);

  private readonly totalLetrasPresionadas = signal(0);

  readonly abecedario: string[] = [

    'A','B','C','D','E','F','G',
    'H','I','J','K','L','M','N',
    'Ñ','O','P','Q','R','S','T',
    'U','V','W','X','Y','Z'
  ];


  
  // Traera todas las palabras de la base de datos
  async traerJuegos(){
    return await this.supabaseConexion.clienteSupabase
    .from('palabras')
    .select("*")
  }
  // Reinicia todas las variables, el tiempo, reinicia lo que se muestra en el html
  // y trae una nueva palabra
  async reiniciarJuego(){

    const palabrasLista =
      (await this.traerJuegos()).data;

    const palabra =
      palabrasLista?.[
        Math.floor(
          Math.random() * palabrasLista.length
        )
      ].palabra;

    this.palabraElegida.set(palabra);

    const letras =
      palabra.toUpperCase().split('');

    this.letras.set(letras);

    this._palabraVisible.set(
      Array(letras.length).fill('_')
    );

    this.vidas.set(6);

    this._juegoTerminado.set(false);

    this._estadoJuegoMensaje.set("");

    this._colorEstado.set("");

    this.letrasAcertadas.set(0);

    this.totalLetrasPresionadas.set(0);

    this._letrasPresionadas.set([]);

    this.cambiarSpriteVidas();

    this.puntuacionJuegos.detenerTiempo();

    this.puntuacionJuegos.reiniciarPuntuacion();

    this.puntuacionJuegos.iniciarTiempo();
  }

  // Se encargara de detectar que tecla se toco y si fue correcta o no, 
  // quitando una vida si fue incorrecta
  seleccionarLetra(letra:string){

    this.totalLetrasPresionadas.update(v => v + 1);

    if(this.letrasPresionadas().includes(letra)){
      return;
    }

    this._letrasPresionadas.update(
      letras => [...letras, letra]
    );

    let quitarVida = true;

    const palabraActual =
      [...this.palabraVisible()];

    for(let i = 0; i < this.letras().length; i++){

      if(this.letras()[i] === letra){

        palabraActual[i] = letra;

        quitarVida = false;

        this.letrasAcertadas.update(v => v + 1);

        this.puntuacionJuegos.sumarAcierto();
      }
    }

    this._palabraVisible.set(palabraActual);

    if(quitarVida){

      this.vidas.update(v => v - 1);

      this.puntuacionJuegos.restarError();
    }

    this.estadoJuego();

    this.cambiarSpriteVidas();
  }

  // Establecera si se gano o perdio la partida y subira
  //  los datos a la base de datos
  estadoJuego(){

    if(this.vidas() <= 0){

      this._juegoTerminado.set(true);

      this.puntuacionJuegos.detenerTiempo();

      this._estadoJuegoMensaje.set("Perdiste");

      this._colorEstado.set("mensajePerder");

      this.subirDatosAhorcado();
    }

    if(this.letrasAcertadas() === this.palabraElegida().length)
      {

      this._juegoTerminado.set(true);

      this.puntuacionJuegos.detenerTiempo();

      this._estadoJuegoMensaje.set("Ganaste!");

      this._colorEstado.set("mensajeGanar");

      this.subirDatosAhorcado();
    }
  }

  // Cambiara la imagen del ahorcado para representar las vidas
  cambiarSpriteVidas(){

    this._vidasJugador.set(
      `SpriteAhorcado/Ahorcado${this.vidas()}Vidas.png`
    );
  }

  // Cuando termine la partida subira los datos de la partida a la 
  // base de datos
  async subirDatosAhorcado(){
    const correo = await this.puntuacionJuegos.traerCorreoUsuario();

    return await this.supabaseConexion
      .clienteSupabase
      .from('puntajeAhorcado')
      .insert([
        {
          nombre: this.puntuacionJuegos.obtenerNombreSesion(),

          correo: correo,

          letrasSeleccionadas: this.totalLetrasPresionadas(),

          tiempo: this.puntuacionJuegos.tiempoJugado(),

          puntaje: this.puntuacionJuegos.puntuacion()
        }
      ]);
  }
}
