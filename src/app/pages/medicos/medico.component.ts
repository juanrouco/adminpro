import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', new Hospital('', '', ''));
  hospital: Hospital = new Hospital('');

  constructor(private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalUploadService: ModalUploadService) {

    this.activatedRoute.params.subscribe(params => {

      const id = params.id;

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }

    });

  }

  ngOnInit() {

    this.hospitalService.cargarHospitales().subscribe((resp: any) => {

      this.hospitales = resp.hospitales;

    });

    this.modalUploadService.notificacion.subscribe((resp: any) => {

      this.medico.img = resp.medico.img;

    });

  }

  cargarMedico(id: string) {

    this.medicoService.cargarMedico(id).subscribe((medico: Medico) => {

      this.medico = medico;

      this.cambioHospital(this.medico.hospital._id);

    });

  }

  guardarMedico(f: NgForm) {

    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico).subscribe((medico: Medico) => {
      this.medico._id = medico._id;
      this.router.navigate(['/medico', medico._id]);
    });

  }

  cambioHospital(id: string) {

    this.hospitalService.obtenerHospital(id).subscribe((hospital) => this.hospital = hospital);

  }

  cambiarFoto() {

    this.modalUploadService.mostrarModal('medicos', this.medico._id);

  }

}
