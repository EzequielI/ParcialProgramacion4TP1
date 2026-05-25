export interface Usuarios{
    id: number;
    nombre: string;
}

export interface Mensaje{
    id: number;
    idUsuario: number;
    contenido: string;
    usuarios?: Usuarios;
    created_at: Date;
    mensajePropio: boolean;
}