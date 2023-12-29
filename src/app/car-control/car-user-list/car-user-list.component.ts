import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CarUserControlService } from '../service/car-user-control.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-car-user-list',
  standalone: true,
  templateUrl: './car-user-list.component.html',
  styleUrls: ['./car-user-list.component.scss'],
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
  ],
})
export class CarUserListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'placa',
    'cor',
    'marca',
    'motorista',
    'motivoUtilizacao',
    'status',
    'acao',
  ];

  dataSource!: MatTableDataSource<any>;

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
    this.carUserControlService.getCarUsages().subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  deleteCarUsage(id: number) {
    let confirm = window.confirm(
      'Tem certeza que quer deletar este carro em uso?'
    );
    if (confirm) {
      this.carUserControlService.deleteCarUser(id).subscribe({
        next: (res) => {
          alert('Carro em uso deletado!');
          this.getCarUserList();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
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
