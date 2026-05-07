import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Supabase } from './supabase';
import { usuario } from '../modelos/usuario/usuario-module';
import { single } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Autenticacion {

  private route = inject(Router);
  private supabase = inject(Supabase);

}
