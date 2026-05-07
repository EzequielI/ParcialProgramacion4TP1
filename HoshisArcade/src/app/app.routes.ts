import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path:"",
        redirectTo: "bienvenida",
        pathMatch: "full"
    },
    {
        path:"login",
        loadComponent: () => import('./components/vistas/login/login').then(m => m.Login)
    },
    {
        path:"registro",
        loadComponent: () => import('./components/vistas/registro/registro').then(m => m.Registro)
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
        path:"**",
        redirectTo:"bienvenida",
        pathMatch: "full"
    }
];
