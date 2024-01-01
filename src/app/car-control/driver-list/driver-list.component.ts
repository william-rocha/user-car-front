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

@Component({
  selector: 'app-driver-list',
  standalone: true,
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
  imports: [MaterialModule, FormsModule, CommonModule],
})
export class DriverListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'nome', 'status', 'acao'];

  dataSource!: MatTableDataSource<any>;

  nomeFilter: string = '';

  private filtroSubject = new Subject<string>();

  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private carUserControlService: CarUserControlService
  ) {}

  ngOnInit(): void {
    this.getDriverListFilter('');

    this.filtroSubject
      .pipe(debounceTime(1200)) // debounce gera intervalo para evitar de bater na api a cada clique no filter
      .subscribe((nome: string) => {
        this.getDriverListFilter(nome);
      });
  }

  openAddEditDriverDialog() {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.getDriverListFilter();
        }
      },
    });
  }

  getDriverListFilter(nome = this.nomeFilter): void {
    this.isLoading = true;
    this.carUserControlService
      .getDriversByNome(nome)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  applyFilter(ev: any) {
    this.isLoading = true;
    const nome = ev.target.value.toUpperCase();

    this.nomeFilter = nome;
    this.filtroSubject.next(nome);
  }

  deleteDriver(row: any) {
    if (row.status === 'emUso') {
      alert(
        'Para excluir um motorista que está atualmente utilizando um veículo, é necessário primeiro encerrar o registro no módulo "Veículos em Uso".'
      );
      return;
    }
    let confirm = window.confirm(
      `Tem certeza que quer deletar este motorista do id: ${row.id}?`
    );
    if (confirm) {
      this.carUserControlService.deleteDriver(row.id).subscribe({
        next: (res) => {
          alert('Motorista deletado!');
          this.getDriverListFilter();
        },
        error: (err) => {
          alert(`Erro ao deletar motorista: ${err.error.message}`);
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
          this.getDriverListFilter();
        }
      },
    });
  }
}
