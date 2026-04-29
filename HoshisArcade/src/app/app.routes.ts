import { Routes } from '@angular/router';
import { Login } from './components/vistas/login/login';
import { Registro } from './components/vistas/registro/registro';
import { QuienSoy } from './components/vistas/quien-soy/quien-soy';
import { Bienvenida } from './components/vistas/bienvenida/bienvenida';

export const routes: Routes = [

    {
        path:"",
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path:"login",
        component: Login
    },
    {
        path:"registro",
        component:Registro
    },
    {
        path:"quien-soy",
        component:QuienSoy
    },
    {
        path:"bienvenida",
        component:Bienvenida
    },
    {
        path:"**",
        redirectTo:"login",
        pathMatch: "full"
    }
];
