import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit{

  formularioRegistro! : FormGroup

  constructor(private router: Router, private fb : FormBuilder){}

  registrarCuenta():void{
    this.router.navigate(['/login'])
  }

  
  ngOnInit(): void {
    this.formularioRegistro = this.fb.group({
      correo:["", Validators.email],
      nombre:["", Validators.pattern('^[a-zA-Z]+$')],
      apellido:["", Validators.pattern('^[a-zA-Z]+$')],
      edad:["", [Validators.min(10),Validators.max(99)]],
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
    console.log(this.formularioRegistro.value)
    if (this.formularioRegistro.invalid) {
      console.log("Formulario invalido");
      return;
      
    }else{
      this.router.navigate(['/login'])
    }
  }

  
}
