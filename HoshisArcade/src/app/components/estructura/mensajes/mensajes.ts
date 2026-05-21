import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as bootstrap from "bootstrap"

@Component({
  selector: 'app-mensajes',
  imports: [],
  templateUrl: './mensajes.html',
  styleUrl: './mensajes.css',
})
export class Mensajes implements OnChanges{

  //Angular al detectar un cambio en mensajeError por otro componente 
  // con el input le dira a ngOnChanges que cambie y haga aparecer al modal
  @Input() mensajeError: string = "";
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mensajeError'] && this.mensajeError != ""){
      const modalAviso = document.getElementById('modalAviso');
    
      if (modalAviso) {
        const modal = new bootstrap.Modal(modalAviso);
        modal.show();
      }
    }

  }
}
