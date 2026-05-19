import { Routes } from '@angular/router';
import { usuarioLogueado } from './guards/usuarioLogueado';
import { loginGuard } from './guards/loginGuard';

export const routes: Routes = [

    {
        path:"",
        loadComponent: () => import('./components/vistas/login/login').then(m => m.Login),
        canActivate:[loginGuard]
    },

    {
        path:"registro",
        loadComponent: () => import('./components/vistas/registro/registro').then(m => m.Registro),
        canActivate:[loginGuard]
    },
    {
        path:"quien-soy",
        loadComponent: () => import('./components/vistas/quien-soy/quien-soy').then(m => m.QuienSoy)
    },
    {
        path:"bienvenida",
        loadComponent: () => import('./components/vistas/bienvenida/bienvenida').then(m => m.Bienvenida)
    },
    {
        path:"ahorcado",
        loadComponent: () => import('./components/juegos/ahorcado/ahorcado').then(m => m.Ahorcado),
        canActivate:[usuarioLogueado]
    },
    {
        path:"mayorOmenor",
        loadComponent: () => import('./components/juegos/mayor-omenor/mayor-omenor').then(m => m.MayorOMenor),
        canActivate:[usuarioLogueado]
    },
    {
        path:"preguntados",
        loadComponent: () => import('./components/juegos/preguntados/preguntados').then(m => m.Preguntados),
        canActivate:[usuarioLogueado]
    },
    {
        path:"wordle",
        loadComponent: () => import('./components/juegos/wordle/wordle').then(m => m.Wordle),
        canActivate:[usuarioLogueado]
    },
    {
        path:"**",
        redirectTo:"",
    }
];
