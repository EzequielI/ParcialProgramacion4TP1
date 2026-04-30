import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Alumnos {

  private http = inject(HttpClient);
  private alumnoUrl = 'https://api.github.com/users/EzequielI'


  cargarAlumno(): void{
    this.http.get<any[]>(this.alumnoUrl).subscribe({
      next: (data) =>{

        const alumno = data.map(alumnoUrl =>  ({
          id:        alumnoUrl.id,
          nombre:    alumnoUrl.name,     // 'name' = nombre completo (ej: "Leanne Graham")
          apellido:  alumnoUrl.username, // 'username' = alias (ej: "Bret")
          email:     alumnoUrl.email,
          avatar:    'https://via.placeholder.com/150',
          isActive:  true,
          createdAt: new Date()
        }));
      }
    }
  

    
  )}
}
