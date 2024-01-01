import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime, finalize } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { CarUserControlService } from '../service/car-user-control.service';
import { DialogComponent } from './dialog/dialog.component';

type FilterCar = {
  cor: string;
  marca: string;
};
@Component({
  selector: 'app-car-list',
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  imports: [MaterialModule, FormsModule, CommonModule],
})
export class CarListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'placa',
    'cor',
    'marca',
    'status',
    'acao',
  ];

  dataSource!: MatTableDataSource<any>;

  isLoading = true;

  filterCar: FilterCar = {
    cor: '',
    marca: '',
  };

  private getCarListFilterSubject = new Subject<FilterCar>();

  constructor(
    private dialog: MatDialog,
    private carUserControlService: CarUserControlService
  ) {}

  ngOnInit(): void {
    this.getCarList();

    this.getCarListFilterSubject
      .pipe(debounceTime(1200)) // debounce gera intervalo para evitar de bater na api a cada clique no filter
      .subscribe((carFilter: FilterCar) => {
        this.getCarListFilter(carFilter);
      });
  }

  openAddEditCarDialog() {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCarList();
        }
      },
    });
  }

  getCarList() {
    this.isLoading = true;
    this.carUserControlService
      .getCarList()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          alert(`Ouve um erro ao carregar lista de Carros.`);
        },
      });
  }

  applyFilter(ev: any, corMarca: 'cor' | 'marca') {
    this.isLoading = true;

    this.filterCar[corMarca] = ev.target.value.toUpperCase();

    this.getCarListFilterSubject.next(this.filterCar);
  }

  getCarListFilter({ cor, marca }: FilterCar): void {
    this.isLoading = true;

    this.carUserControlService
      .getCarListFiltered({ cor, marca })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          alert(`Ouve um erro ao carregar lista de Carros.`);
        },
      });
  }

  deleteCar(id: number) {
    if (true) {
      this.carUserControlService.deleteCar(id).subscribe({
        next: (res) => {
          alert('Carro deletado!');
          this.getCarList();
        },
        error: (err) => {
          alert(`Erro ao deletar Carro: ${err.error.message}`);
          console.log(err);
        },
      });
    }
  }

  abrirFormEdicao(data: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCarList();
        }
      },
    });
  }
}
