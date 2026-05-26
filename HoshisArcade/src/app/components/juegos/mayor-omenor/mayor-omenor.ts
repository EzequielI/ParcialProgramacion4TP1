import { Component, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { MayorOmenor } from '../../../servicios/mayor-omenor-logica';
import { Auth } from '../../../servicios/auth';
import { ChatMensajes } from '../../vistas/chat-mensajes/chat-mensajes';

@Component({
  selector: 'app-mayor-omenor',
  imports: [RouterLink,ChatMensajes],
  templateUrl: './mayor-omenor.html',
  styleUrl: './mayor-omenor.css',
})
export class MayorOMenor {

  readonly juego = inject(MayorOmenor);

  private readonly auth = inject(Auth);
  mostrarChat = signal(true);
  readonly sesion = this.auth.sesion_iniciada;

  ngOnInit() {
    this.juego.iniciarJuego();
  }
}
