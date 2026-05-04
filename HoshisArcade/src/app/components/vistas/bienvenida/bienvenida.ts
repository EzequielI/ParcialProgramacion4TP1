import { Component } from '@angular/core';
import { Navbar } from '../../estructura/navbar/navbar';
import { juegos, lista_juegos } from '../../../modelos/juegos/juegos-module';

@Component({
  selector: 'app-bienvenida',
  imports: [Navbar],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {

    juegos: juegos[] = lista_juegos
}
