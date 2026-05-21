import { inject, Injectable } from '@angular/core';
import { enviroment } from './enviroment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AhorcadoLogica {
    private readonly supabaseConexion = inject(Auth)

  constructor(){}

  async traerJuegos(){
    return await this.supabaseConexion.clienteSupabase.from('palabras').select("*")
  }
}
