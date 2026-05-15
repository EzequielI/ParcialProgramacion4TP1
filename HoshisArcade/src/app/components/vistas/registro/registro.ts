import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../servicios/auth';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit{

  formularioRegistro! : FormGroup

  constructor(private router: Router, private fb : FormBuilder, private supabase : Auth){}

  registrarCuenta():void{
    this.router.navigate(['/login'])
  }

  
  ngOnInit(): void {
    this.formularioRegistro = this.fb.group({
      correo:["", Validators.email],
      //Arreglar los patterns que deja poner solo espacio
      nombre:["", Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')],
      apellido:["", Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')],
      edad:["", [Validators.pattern('^[0-9]+$'),Validators.min(10),Validators.max(99)]],
      clave:["", Validators.minLength(4)]
    })
    
  }
  
  get correo() {
    return this.formularioRegistro.get('correo')
  }
  get nombre() {
    return this.formularioRegistro.get('nombre')
  }
  get apellido() {
    return this.formularioRegistro.get('apellido')
  }
  get edad() {
    return this.formularioRegistro.get('edad')
  }
  get clave() {
    return this.formularioRegistro.get('clave')
  }
  
  enviarForm():void{
    if (this.formularioRegistro.invalid) {
      console.log("Formulario invalido");
      this.formularioRegistro.markAllAsTouched();
      return;
      
    }else{
      console.log(this.formularioRegistro.value)
      this.supabase.registrar(this.correo?.value , this.clave?.value);
      this.supabase.guardarDatosUsuarios(this.correo?.value, this.nombre?.value, this.apellido?.value , parseInt(this.edad?.value))
    }
  }
  
}
