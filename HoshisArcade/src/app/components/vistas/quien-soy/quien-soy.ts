import { Component, inject, OnInit, signal } from '@angular/core';
import { Alumno } from '../../../servicios/alumno';
import { Alumnos } from '../../../modelos/alumnos/alumno-module';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {

  // Creamos una variable de tipo signal que sea de tipo Alumno para contener los datos traidos de la Api,
  // que tambien puede ser null asi se inicializa y cuando se llamen los datos en el orden de ejecucion no tire error
  alumno = signal<Alumnos | null>(null)

  // Importamos http desde Alumno el servicio con una injeccion en vez de un constructor al ser un metodo mas moderno
  http = inject(Alumno)

  // Esta funcion se encargara de traer la URL, suscribirse para que actualice cada vez que traiga los datos y importarselos a la
  // variable alumnos
  obtenerAlumno(){
    this.http.obtenerAlumnoUrl('https://api.github.com/users/EzequielI').subscribe({
      next:(data: any) =>{
      this.alumno.set(data);
      },
      error: (error) => {
        console.error("Error al traer al Alumno", error)
      }
    })
  }


    // Se encargara de ejecutar la funcion cuando se inicie el servidor
  ngOnInit(){
    this.obtenerAlumno();
    
  }

}
