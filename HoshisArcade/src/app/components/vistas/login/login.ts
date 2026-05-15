import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit{

  formularioLogin!: FormGroup;
  sesion_iniciada = true;

  constructor(private router: Router, private fb : FormBuilder){}

  iniciarSesion(): void{
    this.router.navigate(['/bienvenida']);
  }
  registrarse(): void{
    this.router.navigate(['/registro'])
  }

  ngOnInit(): void{
    this.formularioLogin = this.fb.group({
      correo: ["", Validators.email],
      clave: ["", Validators.minLength(4)]
    })
  }
}
