import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  sesion_iniciada = signal(false)
}
