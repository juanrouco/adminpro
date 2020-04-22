import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  cargando: boolean = true;

  constructor(public medicoService: MedicoService) { }

  ngOnInit() {

    this.cargarMedicos();

  }

  cargarMedicos() {

    this.cargando = true;

    this.medicoService.cargarMedicos(this.desde).subscribe((medicos: Medico[]) => {

      this.medicos = medicos;
      this.cargando = false;

    });

  }

  buscarMedico(termino: string) {

    if (termino.length === 0) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedicos(termino).subscribe((medicos: Medico[]) => {

      this.medicos = medicos;

    });

  }

  borrarMedico(medico: Medico) {

    sweetAlert({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar ' + medico.nombre,
      icon: 'warning',
      buttons: [ 'Cancelar', 'Aceptar'],
      dangerMode: true
    }).then((borrar) => {

      if (!borrar) {
        return;
      }

      this.medicoService.borrarMedico(medico._id).subscribe(() => {
        this.cargarMedicos();
      });
    });

  }

  cambiarDesde(valor: number) {

    const desde = this.desde + valor;

    if (desde >= this.medicoService.totalMedicos) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();

  }

}
