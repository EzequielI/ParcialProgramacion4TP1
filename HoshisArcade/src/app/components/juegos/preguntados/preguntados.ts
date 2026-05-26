import { Component, inject, OnInit, signal } from '@angular/core';
import { Preguntados } from '../../../servicios/preguntados-logica';
import { RouterLink } from "@angular/router"; 
import { Mensajes } from '../../estructura/mensajes/mensajes';
import { Auth } from '../../../servicios/auth';
import { ChatMensajes } from '../../vistas/chat-mensajes/chat-mensajes';

@Component({
  selector: 'app-preguntados',
  imports: [RouterLink,Mensajes,ChatMensajes],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css'
})
export class PreguntadosComponent implements OnInit {

  readonly preguntados = inject(Preguntados);

  private readonly auth = inject(Auth);

  mostrarChat = signal(true)
  readonly sesion = this.auth.sesion_iniciada;

  async ngOnInit() {

    await this.preguntados.traerPreguntas();
  }

  async responder(respuesta: string) {

    await this.preguntados.responder(respuesta);

    if (this.preguntados.juegoTerminado()) {

      await this.preguntados.subirDatosPreguntados();
    }
  }
  
}