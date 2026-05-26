import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../servicios/auth';
import { Mensajes } from '../../estructura/mensajes/mensajes';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule,Mensajes],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit{

  formularioRegistro! : FormGroup;
  private datosUsuarios : any;
  mensajeError: string = "";

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(Auth);
  
  ngOnInit(): void {
    this.formularioRegistro = this.fb.group({
      correo:["", Validators.email],
      nombre:["", [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$'), ]],
      apellido:["", Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+( [a-zA-ZáéíóúÁÉÍÓÚñÑ]+)*$')],
      edad:["", [Validators.pattern('^[0-9]+$'),Validators.min(10),Validators.max(99)]],
      clave:["", Validators.minLength(6)]
    });
    
  };
  //Getters para obtener los valores de los campos
  get correo() {
    return this.formularioRegistro.get('correo');
  };
  get nombre() {
    return this.formularioRegistro.get('nombre');
  };
  get apellido() {
    return this.formularioRegistro.get('apellido');
  };
  get edad() {
    return this.formularioRegistro.get('edad');
  };
  get clave() {
    return this.formularioRegistro.get('clave');
  };
  
  async enviarForm(){
    if (this.formularioRegistro.invalid) {
      this.mensajeError = 'Formulario invalido';
      this.formularioRegistro.markAllAsTouched();
      return;
      
    };
    const respuesta = (await this.supabase.obtenerUsuarioDatos());
    this.datosUsuarios = respuesta.data;

    const correoExiste = this.datosUsuarios.some(
      (usuario: any) => usuario.correo === this.correo?.value
    );
    
    if (correoExiste) {
      this.mensajeError = 'Este usuario ya esta registrado';
      return;
    };

    // Guardar datos para inicio
    const{error} = await this.supabase.registrar(
      this.correo?.value,
      this.clave?.value
    );
        
    if(error){
      this.mensajeError = 'Error al registrar usuario';
      return;
    };
        
    // Guardar datos generales del Usuario
    await this.supabase.guardarDatosUsuarios(
      this.correo?.value,
      this.nombre?.value,
      this.apellido?.value,
      parseInt(this.edad?.value)
    );
      
    this.supabase.cerrarSesionRegistro();
    this.router.navigate(['']);
  };
  
  
}
