import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../servicios/auth';
import { usuario } from '../../../modelos/usuario/usuario-module';
import * as bootstrap from "bootstrap"

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
  mensajeLogin: string = ""

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private supabase = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  async iniciarSesion(){
      if (this.formularioLogin.invalid) {
        this.formularioLogin.markAllAsTouched();
        this.modalError('Datos incompletos')
        return;
        
      }else{
        this.supabase.iniciarSesion(this.correo?.value, this.clave?.value).then((respuesta) =>{
          if (respuesta.error) {
            this.modalError('Credenciales incorrectas')
            
          }else{
              localStorage.setItem("sesionActual",this.correo?.value)
              this.sesion_iniciada = true;
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

  // Metodo que muestra el modal generico usado para mostrar mensajes de error
    modalError(mensaje: string){
      this.mensajeLogin = mensaje;
  
      this.cdr.detectChanges();
  
      const modalAviso = document.getElementById('modalAviso');
  
      if (modalAviso) {
        const modal = new bootstrap.Modal(modalAviso);
        modal.show();
      }
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
