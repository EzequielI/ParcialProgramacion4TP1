import { Component, ElementRef, inject, OnInit, output, ViewChild } from '@angular/core';
import { Chat } from '../../../servicios/chat';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../servicios/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-mensajes',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-mensajes.html',
  styleUrl: './chat-mensajes.css',
})
export class ChatMensajes implements OnInit{

  @ViewChild('contenedorMensajes')
  private contenedorMensajes!: ElementRef;
  
  readonly chat = inject(Chat);
  private readonly supabase = inject(Auth)
  
  readonly cerrarChat = output<void>();
  nuevoMensaje = '';
  readonly usuario = this.supabase.nombreSesionActual;

  async ngOnInit(){
    await this.supabase.mostrarUsuario();
    await this.chat.cargarMensajes();

    setTimeout(() => {
      this.bajarScroll();
    }, 0);

    this.chat.escucharMensajes();
  }

  async EnviarMensaje(){
    const nombre = this.usuario();
    const texto = this.nuevoMensaje.trim();

    if (nombre && texto) {
      await this.chat.enviarMensaje(texto,nombre);
      this.nuevoMensaje = "";
      
      setTimeout(() => {
        this.bajarScroll();
      }, 0);
    }
  }

  private bajarScroll(): void {
    const elemento = this.contenedorMensajes.nativeElement;

    elemento.scrollTop = elemento.scrollHeight;
  }
}
