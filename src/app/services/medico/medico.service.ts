import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../service.index';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(private http: HttpClient,
              private usuarioService: UsuarioService) { }

  cargarMedicos(desde: number = 0) {

    const url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get(url).pipe(
      map((resp: any) => {

        this.totalMedicos = resp.total;
        return resp.medicos;

      })
    );

  }

  cargarMedico(id: string) {

    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url).pipe(
      map((resp: any) => {
        return resp.medico;
      })
    );

  }

  buscarMedicos(termino: string) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http.get(url).pipe(
      map((resp: any) => {
        this.totalMedicos = resp.medicos.length;
        return resp.medicos;
      })
    );

  }

  guardarMedico(medico: Medico) {

    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {

      url += '/' + medico._id + '?token=' + this.usuarioService.token;

      return this.http.put(url, medico).pipe(
        map((resp: any) => {

          sweetAlert('Médico actualizado', resp.medico.nombre, 'success');

          return resp.medico;

        })
      );

    } else {

      url += '?token=' + this.usuarioService.token;

      return this.http.post(url, medico).pipe(
        map((resp: any) => {

          sweetAlert('Médico creado', resp.medico.nombre, 'success');

          return resp.medico;

        })

      );
    }

  }

  borrarMedico(id: string) {

    const url = URL_SERVICIOS + '/medico/' + id + '?token=' + this.usuarioService.token;

    return this.http.delete(url).pipe(
      map((resp: any) => {

        sweetAlert('Médico borrado', 'El médico ha sido eliminado correctamente', 'success');

        return true;

      })
    );

  }

}
