import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../servicios/auth';
import * as bootstrap from 'bootstrap';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit{

  formularioRegistro! : FormGroup;
  private datosUsuarios : any;
  mensajeRegistro: string = '';

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(Auth);
  private readonly cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    this.formularioRegistro = this.fb.group({
      correo:["", Validators.email],
      //Arreglar los patterns que deja poner solo espacio
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
      this.modalError('Formulario invalido');
      this.formularioRegistro.markAllAsTouched();
      return;
      
    };
    const respuesta = (await this.supabase.obtenerUsuarioDatos());
    this.datosUsuarios = respuesta.data;

    const correoExiste = this.datosUsuarios.some(
      (usuario: any) => usuario.correo === this.correo?.value
    );
    
    if (correoExiste) {
      this.modalError('Este usuario ya esta registrado')
      return;
    };

    // Guardar datos para inicio
    const{error} = await this.supabase.registrar(
      this.correo?.value,
      this.clave?.value
    );
        
    if(error){
      this.modalError('Error al registrar usuario');
      return;
    };
        
    // Guardar datos generales del Usuario
    await this.supabase.guardarDatosUsuarios(
      this.correo?.value,
      this.nombre?.value,
      this.apellido?.value,
      parseInt(this.edad?.value)
    );
        
    this.router.navigate(['/login']);
  };
  
  // Metodo que muestra el modal generico usado para mostrar mensajes de error
  modalError(mensaje: string){
    this.mensajeRegistro = mensaje;

    this.cdr.detectChanges();

    const modalAviso = document.getElementById('modalAviso');

    if (modalAviso) {
      const modal = new bootstrap.Modal(modalAviso);
      modal.show();
    }
  }
}
