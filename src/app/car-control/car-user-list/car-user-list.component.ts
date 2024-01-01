import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { CarUserControlService } from '../service/car-user-control.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-car-user-list',
  standalone: true,
  templateUrl: './car-user-list.component.html',
  styleUrls: ['./car-user-list.component.scss'],
  imports: [MaterialModule, CommonModule],
})
export class CarUserListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'motoristaSituacao',
    'motorista',
    'carroStatus',
    'placa',
    'cor',
    'marca',
    'status',
    'motivoUtilizacao',
    'dataInicio',
    'dataFim',
    'acao',
  ];

  dataSource!: MatTableDataSource<any>;

  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private carUserControlService: CarUserControlService
  ) {}

  ngOnInit(): void {
    this.getCarUserList();
  }

  openAddEditCarUserDialog() {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCarUserList();
        }
      },
    });
  }

  getCarUserList() {
    this.isLoading = true;
    this.carUserControlService
      .getCarUsages()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          alert('Ouve um erro ao carregar Registro de Uso');
        },
      });
  }

  deleteCarUsage(id: number) {
    this.carUserControlService.deleteCarUser(id).subscribe({
      next: (res) => {
        alert('Registro de Uso de Carro deletado com sucesso!');
        this.getCarUserList();
      },
      error: (err) => {
        alert('Ocorreu um erro ao deletar Registro de Uso de Carro.');
      },
    });
  }

  openFormEdit(data: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCarUserList();
        }
      },
    });
  }

  finalizarUtilizacaoCarro(row: any) {
    const rowId = row.id;
    this.carUserControlService.finishCarUsage(rowId).subscribe({
      next: (res) => {
        console.log(res);
        this.getCarUserList();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
