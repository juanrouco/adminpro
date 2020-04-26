import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(public http: HttpClient,
              public router: Router,
              public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  renuevaToken() {

  this.cargarStorage();

  const url = URL_SERVICIOS + '/login/renuevatoken?token=' + this.token;

  return this.http.get(url).pipe(
    map((resp: any) => {

      this.token = resp.token;
      localStorage.setItem('token', this.token);

      return true;

    }),
    catchError(err => {

      sweetAlert('No se pudo renovar token', 'No fue posible renovar token', 'error');

      this.logout();

      return throwError(err);

    })
  );

  }

  estaLogueado(): boolean {

    return (this.token && this.token.length > 5);

  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;

  }

  logout() {

    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);

  }

  loginGoogle(token: string) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token }).pipe(
      map((resp: any) => {

        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);

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

        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);

        return true;

      }),
      catchError(err => {

        sweetAlert('Error en login', err.error.mensaje, 'error');

        return throwError(err);

      })
    );

  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario).pipe(
      map((resp: any) => {

        sweetAlert('Usuario creado', usuario.email, 'success');

        return resp.usuario;

      }),
      catchError(err => {

        sweetAlert(err.error.mensaje, err.error.errors.message, 'error');

        return throwError(err);

      })
    );

  }

  actualizarUsuario(usuario: Usuario) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario).pipe(
      map((resp: any) => {

        if (usuario._id === this.usuario._id) {
          this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
        }


        sweetAlert('Usuario actualizado', usuario.nombre, 'success');

      }),
      catchError(err => {

        sweetAlert(err.error.mensaje, err.error.errors.message, 'error');

        return throwError(err);

      })
    );

  }

  cambiarImagen(archivo: File, id: string) {

    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id).then((resp: any) => {

      this.usuario.img = resp.usuario.img;
      this.guardarStorage(id, this.token, this.usuario, this.menu);
      sweetAlert('Imagen actualizada', this.usuario.nombre, 'success');

    }).catch((resp) => {

      console.log(resp);

    });

  }

  cargarUsuarios(desde: number = 0) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get(url);

  }

  buscarUsuarios(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.usuarios;
      })
    );

  }

  borrarUsuario(id: string) {

    const url = URL_SERVICIOS + '/usuario/' + id + '?token=' + this.token;

    return this.http.delete(url).pipe(
      map((resp) => {

        sweetAlert('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');

        return true;

      })
    );

  }

}
