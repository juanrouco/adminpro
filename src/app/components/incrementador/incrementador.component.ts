import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: []
})
export class IncrementadorComponent implements OnInit {

  @Input() leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor:EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('txtProgreso', { static: false }) txtProgreso: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  onChange(newValue: number) {

    if (newValue >= 100) {
      this.progreso = 100;
    } else if (newValue <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = newValue;
    }

    this.txtProgreso.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);
  }

  cambiarValor(valor: number) {
    if (this.progreso >= 100 && valor > 0) {
      return;
    }

    if (this.progreso <= 0 && valor < 0) {
      return;
    }

    this.progreso += valor;

    this.cambioValor.emit(this.progreso);

    this.txtProgreso.nativeElement.focus();
  }
}
