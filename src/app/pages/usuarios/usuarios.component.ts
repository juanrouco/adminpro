import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {

    this.cargarUsuarios();

    this.modalUploadService.notificacion.subscribe((resp: any) => {

      this.cargarUsuarios();

    });

  }

  mostrarModal(id: string) {

    this.modalUploadService.mostrarModal('usuarios', id);

  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService.cargarUsuarios(this.desde).subscribe((resp: any) => {

      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios;
      this.cargando = false;

    });

  }

  cambiarDesde(valor: number) {

    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

  buscarUsuario(termino: string) {

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService.buscarUsuarios(termino).subscribe((usuarios: Usuario[]) => {

      this.usuarios = usuarios;
      this.cargando = false;
      this.totalRegistros = usuarios.length;
      this.desde = 0;

    });

  }

  borrarUsuario(usuario: Usuario) {

    if (usuario._id === this.usuarioService.usuario._id) {
      sweetAlert('No puede borrar el usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    sweetAlert({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar ' + usuario.nombre,
      icon: 'warning',
      buttons: [ 'Cancelar', 'Aceptar'],
      dangerMode: true
    }).then((borrar) => {

      console.log(borrar);

      if (borrar) {
        this.usuarioService.borrarUsuario(usuario._id).subscribe((borrado: boolean) => {
          console.log(borrado);
          this.cargarUsuarios();
        });
      }

    });

  }

  guardarUsuario(usuario: Usuario) {

    this.usuarioService.actualizarUsuario(usuario).subscribe();

  }

}
