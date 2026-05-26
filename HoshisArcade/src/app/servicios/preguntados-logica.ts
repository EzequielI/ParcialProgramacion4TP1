import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PuntuacionJuegos } from './puntuacion-juegos';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class Preguntados {

  private readonly http = inject(HttpClient);

  private readonly supabase = inject(Auth);

  readonly puntuacionServicio = inject(PuntuacionJuegos);

  private readonly _preguntas = signal<any[]>([]);
  readonly preguntas = this._preguntas.asReadonly();

  private readonly _aciertos = signal(0);
  readonly aciertos = this._aciertos.asReadonly();  

  private readonly _indiceActual = signal(0);
  readonly indiceActual = this._indiceActual.asReadonly();


  private readonly _juegoTerminado = signal(false);
  readonly juegoTerminado = this._juegoTerminado.asReadonly();

  private readonly _opcionCorrecta = signal("botonOpcion");
  readonly opcionCorrecta = this._opcionCorrecta.asReadonly();

  private readonly _desactivarBoton = signal(false);
  readonly desactivarBoton = this._desactivarBoton.asReadonly();

  private readonly _mensajeError = signal("");
  readonly mensajeError = this._mensajeError.asReadonly();

  private token = '';

  //Obtendra un token para que si
  private async obtenerToken() {

  const respuesta = await firstValueFrom(
    this.http.get<any>(
      'https://opentdb.com/api_token.php?command=request'
    )
  );

    this.token = respuesta.token;
  }
  
  //Trae las preguntas de una API, las mezcla y 
  // codifica para arreglar errores de lenguaje
  async traerPreguntas() {

    this._desactivarBoton.set(false);
    this.puntuacionServicio.detenerTiempo()
    this.puntuacionServicio.reiniciarPuntuacion()

    this._mensajeError.set("");

    try {

      if (this.token === '') {
        await this.obtenerToken();

      }

    const respuesta = await firstValueFrom(
      this.http.get<any>(
        `https://opentdb.com/api.php?amount=10&type=multiple&token=${this.token}`
      )
    );

    const preguntasFormateadas = respuesta.results.map((pregunta: any) => {

      const respuestas = [
        ...pregunta.incorrect_answers.map(
            (r: string) =>
              this.decodificarTexto(r)
          ),

          this.decodificarTexto(
            pregunta.correct_answer
          )
      ];

      
      const respuestasMezcladas =
        this.mezclarRespuestas(
          [...respuestas]
        );

      return {

        pregunta:
          this.decodificarTexto(
            pregunta.question
          ),

        respuestas:
          respuestasMezcladas,

        correcta:
          this.decodificarTexto(
            pregunta.correct_answer
          )
      };
    });

    this._preguntas.set(preguntasFormateadas);

    this._indiceActual.set(0);

    this._aciertos.set(0);

    this.puntuacionServicio.reiniciarPuntuacion();

    this._juegoTerminado.set(false);

    }catch(error) {

      console.error(
        'Error al traer preguntas',
        error
      );
      
      this._mensajeError.set('Hubo un error al cargar las preguntas. Intenta nuevamente.')
      this._desactivarBoton.set(true);
    }
  }

  //Esto se encargara de la funcionalidad de los botones para responder
  async responder(respuestaUsuario: string) {

    const preguntaActual =
      this._preguntas()[this._indiceActual()];

    if (respuestaUsuario === preguntaActual.correcta) {

      this.puntuacionServicio.sumarAcierto();
      this._opcionCorrecta.set("botonOpcionCorrecta");
      this._aciertos.update(valor => valor + 1);
      this._desactivarBoton.set(true);
      await new Promise(f => setTimeout(f, 2000));
      this._desactivarBoton.set(false);
    }else{
      this._opcionCorrecta.set("botonOpcionIncorrecta");

      this._desactivarBoton.set(true);
      await new Promise(f => setTimeout(f, 2000));
      this._desactivarBoton.set(false);
    }

    if (this._indiceActual() < this._preguntas().length - 1) {

      this._indiceActual.update(valor => valor + 1);
    }
    else {
      this._juegoTerminado.set(true);
    }
    this._opcionCorrecta.set("botonOpcion");
  }

  // Se encarga de mezclar las respuestas para que no esten en el mismo lugar
  private mezclarRespuestas(respuestas: string[]): string[] {

    for (let i = respuestas.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [respuestas[i], respuestas[j]] =
      [respuestas[j], respuestas[i]];
    }
    return respuestas;
  }

  //Decodificara las preguntas para arreglar errores de signos
  private decodificarTexto(
    texto: string
  ): string {

    const txt =
      document.createElement('textarea');

    txt.innerHTML = texto;

    return txt.value;
  }

  //Subira el resultado de la partida a la base de datos
  async subirDatosPreguntados() {

    const correo =
      await this.puntuacionServicio.traerCorreoUsuario();

    return await this.supabase
      .clienteSupabase
      .from('puntajePreguntados')
      .insert([
        {
          nombre:
            this.puntuacionServicio.obtenerNombreSesion(),

          correo: correo,

          puntaje: this.puntuacionServicio.puntuacion(),

          preguntasAcertadas:
            this._aciertos(),
        }
      ]);
  }
}