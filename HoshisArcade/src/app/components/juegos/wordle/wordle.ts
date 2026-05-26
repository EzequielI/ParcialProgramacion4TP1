import { Component, inject, OnInit, signal } from '@angular/core';
import { WorldeLogica } from '../../../servicios/wordle-logica';
import { PuntuacionJuegos } from '../../../servicios/puntuacion-juegos';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../servicios/auth';
import { ChatMensajes } from '../../vistas/chat-mensajes/chat-mensajes';

@Component({
  selector: 'app-wordle',
  imports: [RouterLink, ChatMensajes],
  templateUrl: './wordle.html',
  styleUrl: './wordle.css'
})
export class WordleComponent implements OnInit{

  readonly wordle = inject(WorldeLogica);
  readonly puntuacion = inject(PuntuacionJuegos);
  private readonly auth = inject(Auth);

  mostrarChat = signal(true)
  readonly sesion = this.auth.sesion_iniciada;

  async jugar() {
    await this.wordle.confirmarPalabra();
  }

  async ngOnInit() {
    this.wordle.reiniciarJuego()
  }

}