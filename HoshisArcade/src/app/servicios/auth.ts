import { inject, Injectable, signal } from '@angular/core';
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

  constructor(){
    this.clienteSupabase = createClient(this.supabaseUrl, this.supabaseKey)
  }
  //Registrar sesion
  async registrar(correo:string, clave:string){
    return await this.clienteSupabase.auth.signUp({
      email:correo,
      password:clave,
    });
  }
  //Iniciar sesion
  async iniciarSesion(correo:string,clave:string){
    return await this.clienteSupabase.auth.signInWithPassword({ 
      email: correo, 
      password: clave,
    })
  }
  //Guardar datos en la base de datos
  async guardarDatosUsuarios(
    usuarioCorreo: string,
    usuarioNombre: string, 
    usuarioApellido: string, 
    usuarioEdad:number
  ){
    return await this.clienteSupabase.from('usuarios').insert([
      {
        correo:usuarioCorreo,
        nombre:usuarioNombre,
        apellido: usuarioApellido,
        edad:usuarioEdad

      }
  ]);
  }

  async obtenerDatosUsuarios(){
    return await this.clienteSupabase.from('usuarios').select('*')
  }

}
