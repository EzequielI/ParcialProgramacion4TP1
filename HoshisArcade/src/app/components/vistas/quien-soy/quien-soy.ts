import { Component, inject, OnInit } from '@angular/core';
import { Navbar } from '../../estructura/navbar/navbar';
import { HttpClient } from '@angular/common/http';
import { Alumno } from '../../../modelos/alumno/alumno-module';

@Component({
  selector: 'app-quien-soy',
  imports: [Navbar],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {
  private http = inject(HttpClient);
  private alumnoUrl = 'https://api.github.com/users/EzequielI'

  // Este metodo nos permitira traer mediante peticion http
  // los datos de la api y formatearlos con como esta puesto en
  // la interfaz creada Alumno
  cargarAlumno(){
    return this.http.get<Alumno>(this.alumnoUrl)
  }

  
  // Aca ejecutaremos el metodo anterior y nos suscribiremos para que empiece
  // a funcionar y en la variable alumno nos vuelque los datos que le pedimos
  // sin subscribe no funcionaria ya que es un observable el dato al traerlo con
  // una peticion HTTP
  mostrarAlumno():void{
    this.cargarAlumno().subscribe(data => {
      this.alumno = data;
    });
  }
  // El signo de pregunta la hace opcional por ende no necesita ser inicializada
  // luego recibira el dato cuando se traigan los datos
  alumno?: Alumno;

  ngOnInit(){
    this.mostrarAlumno();
  }

  // Tengo que buscar bien y entender como aplicar los datos que traiga de 
  // una url con HttpClient y como hago en el caso de un alumno o mas

}
