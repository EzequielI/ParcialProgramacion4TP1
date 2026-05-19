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

  router = inject(Router)
  usuarioActivo = inject(Auth);

  //Gestionara si el boton iniciar sesion dice cerrar sesion o iniciar sesion
  inicioSesion = this.usuarioActivo.sesion_iniciada;
  //Mostrara el nombre actual
  nombreSesionActual = this.usuarioActivo.nombreSesionActual;

  async ngOnInit() {
    const sesionActual = localStorage.getItem("sesionActual");

    if (sesionActual) {

      await this.usuarioActivo.mostrarUsuario();
    }

  }
  
  cerrarSesion(){
    localStorage.clear();

    this.usuarioActivo.sesion_iniciada.set(false);

    this.usuarioActivo.nombreSesionActual.set('');

  }

  iniciarSesion(){
    this.router.navigate(['/login']);
  }
}
