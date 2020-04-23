import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService) { }

  canActivate() {

    if (this.usuarioService.usuario.role === 'ADMIN_ROLE') {
      return true;
    }

    console.log('Bloqueado por el adminguard');

    this.usuarioService.logout();
    return false;

  }

}
