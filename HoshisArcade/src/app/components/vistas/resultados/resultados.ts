import { Component, inject } from '@angular/core';
import { ResultadosLogica } from '../../../servicios/resultados-logica';

@Component({
  selector: 'app-resultados',
  imports: [],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {

  readonly resultados = inject(ResultadosLogica);

  async ngOnInit() {
    await this.resultados.traerTodosLosResultados();
  }
}

