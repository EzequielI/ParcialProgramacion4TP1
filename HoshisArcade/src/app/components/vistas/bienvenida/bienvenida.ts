import { Component, inject } from '@angular/core';
import { juegos, lista_juegos } from '../../../modelos/juegos/juegos-module';
import { Auth } from '../../../servicios/auth';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {

  private readonly auth = inject(Auth);

  readonly  juegos: juegos[] = lista_juegos;
  readonly sesion = this.auth.sesion_iniciada;
}
