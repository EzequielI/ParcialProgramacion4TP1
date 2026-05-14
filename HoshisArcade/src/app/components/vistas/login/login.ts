import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correo = "";
  contrasenia = "";

  constructor(private router: Router){}

  mostrarInformacion(): void{
    console.log(this.contrasenia, this.correo);
  }
  iniciarSesion(): void{
    this.router.navigate(['/bienvenida']);
  }
  registrarse(): void{
    this.router.navigate(['/registro'])
  }
}
