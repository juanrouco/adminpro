import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService) {}

  canActivate(): Promise<boolean> | boolean {

    console.log('Token guard');

    const token = this.usuarioService.token;
    const payload = JSON.parse(atob(token.split('.')[1]));

    const expirado = this.tokenExpirado(payload.exp);

    if (expirado) {
      this.usuarioService.logout();
      return false;
    }

    return this.verificaRenueva(payload.exp);

  }

  tokenExpirado(fechaExp: number) {

    const now = new Date().getTime() / 1000;

    if (fechaExp < now) {
      this.usuarioService.logout();
      return true;
    }

    return false;

  }

  verificaRenueva(fechaExp: number): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

      const tokenExp = new Date(fechaExp * 1000);
      const now = new Date();

      now.setTime(now.getTime() + (4 * 60 * 60 * 1000));

      if (tokenExp.getTime() > now.getTime()) {

        resolve(true);

      } else {

        this.usuarioService.renuevaToken().subscribe((resp: boolean) => {
          resolve(resp);
        }, (err) => {
          this.usuarioService.logout();
          reject(false);
        });

      }

    });

  }

}
