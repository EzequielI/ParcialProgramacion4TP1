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
  //Getters para obtener los valores de los campos
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
  
  async enviarForm(){
    if (this.formularioRegistro.invalid) {
      console.log("Formulario invalido");
      this.formularioRegistro.markAllAsTouched();
      return;
      
    }else{
      console.log(this.formularioRegistro.value);
      const{data,error} = await this.supabase.registrar(
        this.correo?.value,
        this.clave?.value
      );
      console.log("Datos:", data)
      console.log("Error:", error)

      if(error){
    console.log(error.message);
    return;
  }

    // GUARDAR DATOS
    await this.supabase.guardarDatosUsuarios(
      this.correo?.value,
      this.nombre?.value,
      this.apellido?.value,
      parseInt(this.edad?.value)
    );
    
      this.router.navigate(['/login']);
    }
  }
  
}
