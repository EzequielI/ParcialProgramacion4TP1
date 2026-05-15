import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { enviroment } from './enviroment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  sesion_iniciada = signal(false)
  supabaseUrl = inject(enviroment).supabaseUrl
  supabaseKey = inject(enviroment).supabaseKey


  clienteSupabase: SupabaseClient;

  constructor(private router:Router){
    this.clienteSupabase = createClient(this.supabaseUrl, this.supabaseKey)
  }
  //Registrar sesion
  registrar(correo:string, clave:string){
    return this.clienteSupabase.auth.signUp({
      email:correo,
      password:clave,
    });
  }
  //Iniciar sesion
  iniciarSesion(correo:string,clave:string){
    this.clienteSupabase.auth.signInWithPassword({ 
      email:correo, 
      password : clave,
    })
  }
  //Guardar datos en la base de datos
  guardarDatosUsuarios(usuarioCorreo: string, usuarioNombre: string, usuarioApellido: string, usuarioEdad:number){
    this.clienteSupabase.from('usuarios').insert([
      {
        correo:usuarioCorreo,
        nombre:usuarioNombre,
        apellido: usuarioApellido,
        edad:usuarioEdad

      }
  ]).then(({data, error}) =>{
    if (error) {
      console.error('Error:', error.message)
      
    }else{
      this.router.navigate(['/login'])
    }
  })
  }

}
