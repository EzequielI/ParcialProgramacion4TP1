import { Component, inject, signal } from '@angular/core';
import { juegos, lista_juegos } from '../../../modelos/juegos/juegos-module';
import { Auth } from '../../../servicios/auth';
import { RouterLink } from "@angular/router";
import { ChatMensajes } from "../chat-mensajes/chat-mensajes";

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink, ChatMensajes],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {

  private readonly auth = inject(Auth);
  mostrarChat = signal(true);

  readonly  juegos: juegos[] = lista_juegos;
  readonly sesion = this.auth.sesion_iniciada;
}
