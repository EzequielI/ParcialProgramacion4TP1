import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../servicios/auth';
import { usuario } from '../../../modelos/usuario/usuario-module';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{

  formularioLogin!: FormGroup;
  sesion_iniciada = false;
  usuarios: usuario[] = []

  constructor(private router: Router, private fb : FormBuilder, private supabase : Auth){}

  iniciarSesion(): void{
      if (this.formularioLogin.invalid) {
        this.formularioLogin.markAllAsTouched();
        return;

        }else if (true) {
          this.supabase.iniciarSesion(this.correo?.value, this.clave?.value).then((respuesta) =>{
            if (respuesta.error) {
              console.log("Credenciales incorrectas")
              
            }else{
              this.sesion_iniciada = true;
              this.router.navigate(['/bienvenida']);
            }
          })
        }
      
    }

  registrarse(): void{
    this.router.navigate(['/registro'])
  }

  async ngOnInit(){

    this.formularioLogin = this.fb.group({
      correo: ["", Validators.email],
      clave: ["", Validators.minLength(4)]
    })
  }

  get correo(){
    return this.formularioLogin.get('correo');
  }
  get clave(){
    return this.formularioLogin.get('clave');
  }
}
