import { Component, inject } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { Auth } from '../../../servicios/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(public router: Router) {}

  inicio_sesion = inject(Auth).sesion_iniciada

  cerrarSesion(){
    this.inicio_sesion.set(true)
  }

  iniciarSesion(){
    this.inicio_sesion.set(false)
  }
}
