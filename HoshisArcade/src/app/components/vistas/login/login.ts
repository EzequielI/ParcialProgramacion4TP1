import { Component, inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../servicios/auth';
import { Mensajes } from '../../estructura/mensajes/mensajes';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule,Mensajes],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{

  formularioLogin!: FormGroup;
  //Con input desde el componente mensajes cambiara la variable
  mensajeError: string = "";
  
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(Auth);
  
  async iniciarSesion(){
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      this.mensajeError = 'Datos incompletos'
        return;
        
      }else{
        this.supabase.iniciarSesion(this.correo?.value, this.clave?.value).then((respuesta) =>{
          if (respuesta.error) {
            this.mensajeError = 'Credenciales incorrectas'
            
          }else{
            this.supabase.mostrarUsuario();
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
        clave: ["", Validators.minLength(6)]
      })
    }
    
    get correo(){
      return this.formularioLogin.get('correo');
    }
  get clave(){
    return this.formularioLogin.get('clave');
  }
  
  
  inicioRapido1(){
    this.formularioLogin.patchValue({
      correo: "caramelodul@yahoo.com.ar",
      clave:"123456"
    });
  }
  inicioRapido2(){
    this.formularioLogin.patchValue({
      correo: "caramelodul01@gmail.com",
      clave:"1234567"
    });
  }
    inicioRapido3(){
      this.formularioLogin.patchValue({
        correo: "ezequielibaneztejero@gmail.com",
        clave:"12345678"
      });
    }
}
