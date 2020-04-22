import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Hospital } from '../../models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0) {

    const url = URL_SERVICIOS + '/hospital?desde=' + desde;

    return this.http.get(url);

  }

  buscarUsuarios(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http.get(url).pipe(
      map((resp: any) => {

        return resp.hospitales;

      })
    );

  }

  obtenerHospital(id: string) {

    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http.get(url).pipe(
      map((resp: any) => resp.hospital)
    );

  }

  crearHospital(nombre: string) {

    const url = URL_SERVICIOS + '/hospital?token=' + this.usuarioService.token;

    return this.http.post(url, { nombre }).pipe(
      map((resp: any) => {

        sweetAlert('Agregar hospital', 'Hospital creado correctamente', 'success');

        return resp.hospital;

      })
    );

  }

  actualizarHospital(hospital: Hospital) {

    const url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this.usuarioService.token;

    return this.http.put(url, hospital).pipe(
      map((resp: any) => {

        sweetAlert('Hospital actualizado', hospital.nombre, 'success');

        return resp.hospital;

      })
    );

  }

  borrarHospital(id: string) {

    const url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this.usuarioService.token;

    return this.http.delete(url).pipe(
      map((resp: any) => {

        sweetAlert('Hospital borrado', 'El hospital ha sido borrado correctamente', 'success');

        return true;

      })
    );

  }

}
