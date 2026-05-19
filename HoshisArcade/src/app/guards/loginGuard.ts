import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../servicios/auth';

export const loginGuard: CanActivateFn = async  () => {
    //Este se encargara de que el usuario no vaya a login
    //  porque ya inicio sesion
    const router = inject(Router);
    const auth = inject(Auth)
    const logueado = await auth.estaLogueado();

    if (logueado) {
        router.navigate(['/bienvenida']);
        return false;
    }

    return true;
};