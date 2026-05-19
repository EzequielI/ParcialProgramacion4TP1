import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { enviroment } from './enviroment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  sesion_iniciada = signal(false);
  nombreSesionActual = signal("");
  supabase = inject(enviroment)
  supabaseUrl = this.supabase.supabaseUrl
  supabaseKey = this.supabase.supabaseKey

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
  //Obtendremos los correos de los usuarios
  async obtenerCorreoDeUsuarios(){
    return await this.clienteSupabase.from('usuarios').select('correo')
  }
  //Obtendremos todos los datos de los usuarios
  async obtenerUsuarioDatos(){
    return await this.clienteSupabase.from('usuarios').select("*")
  }
  //Traeremos los datos del local storage, los compararemos 
  // para ver si hay algun usuario con ese correo registrado cuando
  // se inicie sesion y si existe mostrara el nombre
  async mostrarUsuario(){

    const sesionActualStorage = localStorage.getItem("sesionActual");

    const respuesta = (await this.obtenerUsuarioDatos()).data;

      if (!respuesta) return;

    respuesta.forEach((usuario: any) => {

      if (sesionActualStorage == usuario.correo) {

        this.nombreSesionActual.set(usuario.nombre);

      }

    });

    this.sesion_iniciada.set(true);
  }

}
