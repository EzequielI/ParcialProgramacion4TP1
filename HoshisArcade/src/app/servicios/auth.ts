import { inject, Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { enviroment } from './enviroment';
@Injectable({
  providedIn: 'root',
})
export class Auth  {

  readonly sesion_iniciada = signal(false);
  readonly nombreSesionActual = signal("");

  private readonly supabase = inject(enviroment)

  readonly supabaseUrl = this.supabase.supabaseUrl
  readonly supabaseKey = this.supabase.supabaseKey

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
  async cerrarSesionRegistro(){
    await this.clienteSupabase.auth.signOut();
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
  //Obtendremos todos los datos de los usuarios
  async obtenerUsuarioDatos(){
    return await this.clienteSupabase.from('usuarios').select("*")
  }
  //Traeremos los datos del getUser, los compararemos 
  // para ver si hay algun usuario con ese correo registrado cuando
  // se inicie sesion y si existe mostrara el nombre
  async mostrarUsuario(){

    const { data: userData } =
      await this.clienteSupabase.auth.getUser();

    const correoUsuario = userData.user?.email;

    if (!correoUsuario) {

      this.sesion_iniciada.set(false);
      this.nombreSesionActual.set("");

      return;
    }

    const respuesta =
      (await this.obtenerUsuarioDatos()).data;

    if (!respuesta) return;

    respuesta.forEach((usuario: any) => {

      if (usuario.correo === correoUsuario) {

        this.nombreSesionActual.set(usuario.nombre);

      }

    });

    this.sesion_iniciada.set(true);
  }

  async estaLogueado(): Promise<boolean> {

    const { data } =
      await this.clienteSupabase.auth.getSession();

    return !!data.session;
  }

  async logout() {

    await this.clienteSupabase.auth.signOut();

    this.sesion_iniciada.set(false);
    this.nombreSesionActual.set("");

  }

}
