import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(public http: HttpClient,
              public router: Router,
              public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  estaLogueado(): boolean {

    return (this.token && this.token.length > 5);

  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;

  }

  logout() {

    this.usuario = null;
    this.token = '';

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {

        this.guardarStorage(resp.id, resp.token, resp.usuario);

        return true;

      })
    );

  }

  login(usuario: Usuario, recordar: boolean) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {

        this.guardarStorage(resp.id, resp.token, resp.usuario);

        return true;

      })
    );

  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {

        sweetAlert('Usuario creado', usuario.email, 'success');

        return resp.usuario;

      }));

  }

  actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {

        this.guardarStorage(resp.usuario._id, this.token, resp.usuario);

        sweetAlert('Usuario actualizado', this.usuario.nombre, 'success');

      })
    );

  }

  cambiarImagen(archivo: File, id: string) {

    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id).then((resp: any) => {

      this.usuario.img = resp.usuario.img;
      this.guardarStorage(id, this.token, this.usuario);
      sweetAlert('Imagen actualizada', this.usuario.nombre, 'success');

    }).catch((resp) => {

      console.log(resp);

    });

  }
}
