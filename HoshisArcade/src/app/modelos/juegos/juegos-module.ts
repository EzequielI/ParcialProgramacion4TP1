
export interface juegos{
  id: number,
  nombre_juego: string,
  descripcion: string,
  foto: string

}

export const lista_juegos: juegos[] = [
  {
    id:1,
    nombre_juego: "Ahorcado",
    descripcion: "En este juego deberas adivinar la palabra antes de que seas ahorcado",
    foto:"../../../Ahorcado_icono.png"
  },
  {
    id:2,
    nombre_juego: "Mayor o menor",
    descripcion: "En este juego deberas adivinar si el numero elegido al azar es mayor o menor que el que esta en la pantalla",
    foto:"../../../Mayor_o_menor_icono.jpg"
  },
  {
    id:3,
    nombre_juego: "Preguntados",
    descripcion: "En este juego deberas responder correctamente las preguntas hasta ganar",
    foto: "../../../Preguntados_icono.png"
  },
  {
    id:4,
    nombre_juego: "Juego propio",
    descripcion: "Este juego esta aun en proceso",
    foto:"asdfasd"
  }
]

export class JuegosModule {}
