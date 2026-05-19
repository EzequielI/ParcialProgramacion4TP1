import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alumno {

  // Iniciamos un constructor para usar los servicios HttpClient mediante la variable http
  private readonly http = inject(HttpClient)

  // Esta funcion tendra un parametro que sera la url de tipo string y devolvera
  // la obtencion de la URL
  obtenerAlumnoUrl(url:string){
    return this.http.get(url);
  }

}
