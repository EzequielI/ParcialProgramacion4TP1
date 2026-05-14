import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {

  nombre = "";
  correo = "";
  contrasenia = "";

  constructor(private router: Router){}

  registrarCuenta():void{
    this.router.navigate(['/login'])
  }

  registro(): void{
    
  }
}
