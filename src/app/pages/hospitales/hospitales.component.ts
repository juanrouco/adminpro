import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare const sweetAlert;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  cargando = true;
  totalRegistros: number;

  desde: number = 0;

  hospitales: Hospital[] = [];

  constructor(private hospitalService: HospitalService,
              private modalUploadService: ModalUploadService) { }

  ngOnInit() {

    this.cargarHospitales();

    this.modalUploadService.notificacion.subscribe((resp: any) => {
      this.cargarHospitales();
    });

  }

  cargarHospitales() {

    this.cargando = true;

    this.hospitalService.cargarHospitales(this.desde).subscribe((resp: any) => {

      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;
      this.cargando = false;

    });

  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hospitalService.buscarUsuarios(termino).subscribe((hospitales: Hospital[]) => {

      this.hospitales = hospitales;
      this.cargando = false;
      this.totalRegistros = hospitales.length;
      this.desde = 0;

    });

  }

  agregarHospital() {

    sweetAlert({
      title: 'Agregar hospital',
      text: 'Ingrese el nombre del hospital',
      icon: 'info',
      dangerMode: true,
      content: {
        element: 'input',
        attributes: { required: true }
      },
      buttons: [
        {
          text: 'Cancelar',
          closeModal: true,
          visible: true,
          value: 0
        },
        {
          text: 'Aceptar',
          closeModal: true,
          visible: true,
          value: 1
        }
      ]
    }).then((nombre) => {

      if (!nombre) {
        sweetAlert('Agregar hospital', 'Debe ingresar el nombre del hospital', 'error');
        return;
      }

      this.hospitalService.crearHospital(nombre).subscribe((hospital: Hospital) => {

        this.cargarHospitales();

      });

    });

  }

  guardarHospital(hospital: Hospital) {

    if (hospital.nombre.length <= 0) {
      sweetAlert('Modificar hospital', 'Debe ingresar un nombre válido para el hospital', 'error');
      return;
    }

    console.log(hospital);

    this.hospitalService.actualizarHospital(hospital).subscribe();

  }

  borrarHospital(hospital: Hospital) {

    sweetAlert({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar ' + hospital.nombre,
      icon: 'warning',
      buttons: [ 'Cancelar', 'Aceptar'],
      dangerMode: true
    }).then((borrar) => {

      if (!borrar) {
        return;
      }

      this.hospitalService.borrarHospital(hospital._id).subscribe(borrado => {

        this.cargarHospitales();

      });

    });

  }

  mostrarModal(id: string) {

    this.modalUploadService.mostrarModal('hospitales', id);

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
    this.cargarHospitales();

  }

}
