import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { Auth } from '../../../servicios/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{

  readonly router = inject(Router)
  private usuarioActivo = inject(Auth);

  //Gestionara si el boton iniciar sesion dice cerrar sesion o iniciar sesion
  readonly inicioSesion = this.usuarioActivo.sesion_iniciada;
  //Mostrara el nombre actual
  readonly nombreSesionActual = this.usuarioActivo.nombreSesionActual;

  async ngOnInit() {
    await this.usuarioActivo.mostrarUsuario();
  }
  
  async cerrarSesion() {

    await this.usuarioActivo.logout();

    this.router.navigate(['/login']);

  }

  iniciarSesion(){
    this.router.navigate(['/login']);
  }
  
}
