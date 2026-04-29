import { Component } from '@angular/core';
import { NavbarLogin } from '../../estructura/navbar-login/navbar-login';
import { Route, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [NavbarLogin, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correo = "";
  contrasenia = "";

  constructor(private router: Router){}

  iniciarSesion(): void{
    console.log(this.contrasenia, this.correo);
    this.router.navigate(['/bienvenida']);
  }
  registrarse(): void{
    this.router.navigate(['/registro'])
  }
}
