import { inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { PuntuacionJuegos } from './puntuacion-juegos';

@Injectable({ providedIn: 'root' })
export class WorldeLogica {

  readonly supabase = inject(Auth);
  readonly puntuacionServicio = inject(PuntuacionJuegos)

  readonly letras = signal<string[]>([
    'A','B','C','D','E','F','G','H','I','J','K',
    'L','M','N','Ñ','P','O','Q','R','S','T',
    'U','V','W','X','Y','Z'
  ]);
  private readonly _juegoTerminado = signal(false)
  readonly juegoTerminado = this._juegoTerminado.asReadonly()

  private readonly _mensaje = signal("");
  readonly mensaje = this._mensaje.asReadonly();

  readonly tablero = signal<string[][]>(
    Array.from({ length: 5 }, () => Array(5).fill(''))
  );

  readonly colores = signal<string[][]>(
    Array.from({ length: 5 }, () => Array(5).fill(''))
  );


  private readonly _filaActual = signal(0);
  private readonly _columnaActual = signal(0);

  private readonly _palabraSecreta = signal("");


  constructor() {

    this.puntuacionServicio.detenerTiempo();
    this.puntuacionServicio.reiniciarPuntuacion();

    this.puntuacionServicio['_puntuacion'].set(5000);

    this.puntuacionServicio.iniciarTiempo();


  }

  // Cargar una palabra aleatoria
  async cargarPalabra() {
    const { data } = await this.supabase.clienteSupabase
      .from('diccionarioWordle')
      .select('palabra');

    const lista = data ?? [];
    const random = lista[Math.floor(Math.random() * lista.length)];

    this._palabraSecreta.set(random.palabra.toLowerCase());
  }

  // Agregar una letra cuando el usuario elija
  agregarLetra(letra: string) {
    if (this._columnaActual() < 5 && this._filaActual() < 5) {
      this.tablero.update(tablero => {
        tablero[this._filaActual()][this._columnaActual()] = letra;
        return [...tablero];
      });
      this._columnaActual.update(v => v + 1);
    }
  }

  // Borrar una letra cuando el usuario elija
  borrarLetra() {
    if (this._columnaActual() > 0) {
      this._columnaActual.update(v => v - 1)

      this.tablero.update(tablero => {
        tablero[this._filaActual()][this._columnaActual()] = '';
        return [...tablero];
      });
    }
  }

  // Se fija que existe la palabra en el diccionario
  async palabraExiste(palabra: string): Promise<boolean> {
    const { data } = await this.supabase.clienteSupabase
      .from('diccionarioWordle')
      .select('palabra')
      .eq('palabra', palabra.toLowerCase())
      .maybeSingle();

    return !!data;
  }

  // Confirmara que la palabra escrita sea la correcta o marcar las letras segun corresponda
  async confirmarPalabra() {

    const palabra = this.tablero()[this._filaActual()].join('').toLowerCase();

    if (palabra.length < 5){
      this._mensaje.set('Completa las 5 letras');
      return;
    }

    // No existe en el diccionario
    const existe = await this.palabraExiste(palabra);

    if (!existe) {
      this._mensaje.set('La palabra no existe');
      return;
    }

    const resultado = Array(5).fill('rojo');
    const secreta = this._palabraSecreta().split('');

    // Letra acertada
    for (let i = 0; i < 5; i++) {
      if (palabra[i] === secreta[i]) {
        resultado[i] = 'verde';
        secreta[i] = '#';
      }
    }

    // La letra esta en la palabra
    for (let i = 0; i < 5; i++) {
      if (resultado[i] === 'verde') continue;

      const index = secreta.indexOf(palabra[i]);

      if (index !== -1) {
        resultado[i] = 'amarillo';
        secreta[index] = '#';
      }
    }

    this.colores.update(colores => {
      colores[this._filaActual()] = resultado;
      return [...colores];
    });

    // El usuario gana
    if (palabra === this._palabraSecreta()) {

      this.puntuacionServicio.sumarAcierto();
      this.puntuacionServicio.detenerTiempo();
      await this.guardarDatos();
      this._mensaje.set('Ganaste!')
      this._juegoTerminado.set(true)
      return;
    }

    this._filaActual.update(v => v + 1);
    this._columnaActual.set(0);

    // El usuario pierde
    if (this._filaActual() === 5) {
      this.puntuacionServicio.restarError();
      this.puntuacionServicio.detenerTiempo();

      await this.guardarDatos();

      this._mensaje.set('Perdiste');
      this._juegoTerminado.set(true);

      return;
    }

    this._mensaje.set('');
  }

  //Subira el resultado de la partida a la base de datos
  async guardarDatos(){
    const correo =
      await this.puntuacionServicio.traerCorreoUsuario();

    return await this.supabase
      .clienteSupabase
      .from('puntajeWordle')
      .insert([
        {
          nombre: this.puntuacionServicio.obtenerNombreSesion(),

          correo: correo,

          puntaje: this.puntuacionServicio.puntuacion(),

          cantidadIntentos:this._filaActual(),
        }
      ]);
  }

  //Reinicia las variables para poder jugar
  async reiniciarJuego() {

    // Reiniciar tablero
    this.tablero.set(
      Array.from({ length: 5 }, () => Array(5).fill(''))
    );

    // Reiniciar colores
    this.colores.set(
      Array.from({ length: 5 }, () => Array(5).fill(''))
    );

    // Reiniciar posiciones
    this._filaActual.set(0);
    this._columnaActual.set(0);

    // Reiniciar estado
    this._juegoTerminado.set(false);
    this._mensaje.set("")
    this.puntuacionServicio['_puntuacion'].set(5000);
    this.puntuacionServicio.iniciarTiempo()

    // Elegir una nueva palabra
    await this.cargarPalabra();
  }
}