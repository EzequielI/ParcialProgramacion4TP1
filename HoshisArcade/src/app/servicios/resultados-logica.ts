import { inject, Injectable, signal } from '@angular/core';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class ResultadosLogica {

  private readonly supabase = inject(Auth);

  readonly puntajesAhorcado = signal<any[]>([]);
  readonly puntajesMayorOMenor = signal<any[]>([]);
  readonly puntajesPreguntados = signal<any[]>([]);
  readonly puntajesWordle = signal<any[]>([]);

  // 🔥 método reutilizable
  private async traerPuntajes(
    tabla: string,
    signalDestino: any
  ) {

    const { data, error } =
      await this.supabase.clienteSupabase
        .from(tabla)
        .select('*')
        .order('puntaje', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    signalDestino.set(data ?? []);
  }

  // Traer datos ahorcado
  async traerPuntajeAhorcado() {

    await this.traerPuntajes(
      'puntajeAhorcado',
      this.puntajesAhorcado
    );
  }

  // Traer datos mayor o menor
  async traerPuntajesMayorOMenor() {

    await this.traerPuntajes(
      'puntajeMayorOMenor',
      this.puntajesMayorOMenor
    );
  }

  // Traer datos preguntados
  async traerPuntajesPreguntados() {

    await this.traerPuntajes(
      'puntajePreguntados',
      this.puntajesPreguntados
    );
  }

  // Traer datos wordle
  async traerPuntajesWordle() {

    await this.traerPuntajes(
      'puntajeWordle',
      this.puntajesWordle
    );
  }

  async traerTodosLosResultados() {

    await Promise.all([
      this.traerPuntajeAhorcado(),
      this.traerPuntajesMayorOMenor(),
      this.traerPuntajesPreguntados(),
      this.traerPuntajesWordle(),
    ]);
  }
}
