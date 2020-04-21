import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  fileUpload: any;

  constructor(private subirArchivoService: SubirArchivoService,
              public modalUploadService: ModalUploadService) { }

  ngOnInit() {
  }

  subirImagen() {

    this.subirArchivoService.subirArchivo(this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id).then(resp => {

      this.modalUploadService.notificacion.emit(resp);
      this.cerrarModal();

    }).catch(err => {
      console.log('Error en la carga', err);
    });

  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this.fileUpload.value = '';

    this.modalUploadService.ocultarModal();
  }

  seleccionImagen(archivo: File, fileUpload: any) {

    this.fileUpload = fileUpload;

    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      sweetAlert('Solo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result.toString();

  }

}
