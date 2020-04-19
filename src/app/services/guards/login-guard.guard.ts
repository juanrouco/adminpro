import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(public usuarioService: UsuarioService,
              public router: Router) { }

  canActivate(): boolean {

    const result = this.usuarioService.estaLogueado();
    if (!result) {
      this.router.navigate(['/login']);
    }
    return result;
  }

}
