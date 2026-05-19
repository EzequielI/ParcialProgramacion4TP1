import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Auth } from "../servicios/auth";



export const usuarioLogueado : CanActivateFn = async ( ) =>{

    //Este se encargara de no permitir al usuario jugar mientras 
    // no este iniciado sesion
    
    const auth = inject(Auth);
    const router = inject(Router)

    const logueado = await auth.estaLogueado();

    if (logueado) {
        return true;
    }

    await auth.logout();
    router.navigate([''])
    return false;
}