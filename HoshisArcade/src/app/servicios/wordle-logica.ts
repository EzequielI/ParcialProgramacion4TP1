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

  filaActual = 0;
  columnaActual = 0;

  palabraSecreta = '';


  constructor() {

    this.puntuacionServicio.detenerTiempo();
    this.puntuacionServicio.reiniciarPuntuacion();

    this.puntuacionServicio['_puntuacion'].set(5000);

    this.puntuacionServicio.iniciarTiempo();

    this.cargarPalabra();
  }

  // Cargar una palabra aleatoria
  async cargarPalabra() {
    const { data } = await this.supabase.clienteSupabase
      .from('diccionarioWordle')
      .select('palabra');

    const lista = data ?? [];
    const random = lista[Math.floor(Math.random() * lista.length)];

    this.palabraSecreta = random.palabra.toLowerCase();
  }

  // Agregar una letra cuando el usuario elija
  agregarLetra(letra: string) {
    if (this.columnaActual < 5 && this.filaActual < 5) {
      this.tablero.update(tablero => {
        tablero[this.filaActual][this.columnaActual] = letra;
        return [...tablero];
      });
      this.columnaActual++;
    }
  }

  // Borrar una letra cuando el usuario elija
  borrarLetra() {
    if (this.columnaActual > 0) {
      this.columnaActual--;

      this.tablero.update(tablero => {
        tablero[this.filaActual][this.columnaActual] = '';
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

    const palabra = this.tablero()[this.filaActual].join('').toLowerCase();

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
    const secreta = this.palabraSecreta.split('');

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
      colores[this.filaActual] = resultado;
      return [...colores];
    });

    // El usuario gana
    if (palabra === this.palabraSecreta) {

      this.puntuacionServicio.sumarAcierto();
      this.puntuacionServicio.detenerTiempo();
      await this.guardarDatos();
      this._mensaje.set('Ganaste!')
      this._juegoTerminado.set(true)
      return;
    }

    this.filaActual++;
    this.columnaActual = 0;

    // El usuario pierde
    if (this.filaActual === 5) {
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

          cantidadIntentos:this.filaActual,
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
    this.filaActual = 0;
    this.columnaActual = 0;

    // Reiniciar estado
    this._juegoTerminado.set(false);
    this._mensaje.set("")
    this.puntuacionServicio['_puntuacion'].set(5000);
    this.puntuacionServicio.iniciarTiempo()

    // Elegir una nueva palabra
    await this.cargarPalabra();
  }
}