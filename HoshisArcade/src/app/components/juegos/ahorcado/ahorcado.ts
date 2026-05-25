import { Component, inject, OnInit, signal } from '@angular/core';
import { AhorcadoLogica } from '../../../servicios/ahorcado-logica';
import { RouterLink } from "@angular/router";
import { ChatMensajes } from '../../vistas/chat-mensajes/chat-mensajes';
import { Auth } from '../../../servicios/auth';

@Component({
  selector: 'app-ahorcado',
  imports: [RouterLink,ChatMensajes],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnInit {

  private readonly auth  = inject(Auth)

  readonly juego = inject(AhorcadoLogica)
  mostrarChat = signal(true)

  readonly sesion = this.auth.sesion_iniciada;

  async ngOnInit() {
    await this.juego.reiniciarJuego();
  }
  
}
