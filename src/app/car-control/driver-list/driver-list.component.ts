import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subject, debounceTime } from 'rxjs';
import { CarUserControlService } from '../service/car-user-control.service';
import { DialogComponent } from './dialog/dialog.component';

type PaginationInfo = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
};

// Exemplo de uso:
const paginationInfo: PaginationInfo = {
  itemsPerPage: 1,
  totalItems: 2,
  currentPage: 1,
  totalPages: 2,
};

@Component({
  selector: 'app-driver-list',
  standalone: true,
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class DriverListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['id', 'nome', 'status', 'acao'];

  dataSource!: MatTableDataSource<any>;

  nomeFilter: string = '';

  private filtroSubject = new Subject<string>();

  length = 50;
  pageSize = 1;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;

  constructor(
    private dialog: MatDialog,
    private carUserControlService: CarUserControlService
  ) {}

  ngOnInit(): void {
    this.getDriverListFilter('', this.pageSize, this.pageIndex);

    this.filtroSubject
      .pipe(debounceTime(1200)) // debounce gera intervalo para evitar de bater na api a cada clique no filter
      .subscribe((nome: string) => {
        this.getDriverListFilter(nome, this.pageSize, this.pageIndex);
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.getDriverListFilter(this.nomeFilter, e.pageSize, e.pageIndex + 1);
  }

  pageDto(pageRes: PaginationInfo) {
    const PageEventDto: any = {
      pageIndex: pageRes.currentPage,
      pageSize: pageRes.itemsPerPage,
      length: pageRes.totalItems,
    };

    this.pageEvent = PageEventDto;

    this.length = pageRes.totalItems;
    this.pageSize = pageRes.itemsPerPage;
    this.pageIndex = pageRes.currentPage - 1;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
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

  getDriverList() {
    this.carUserControlService.getDriverList().subscribe({
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

  getDriverListFilter(
    nome = this.nomeFilter,
    size = this.pageSize,
    page = this.pageIndex
  ): void {
    this.carUserControlService.getDriversByNome(nome, size, page).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res.data);

        console.log(res);

        this.pageDto(res.meta);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  applyFilter(ev: any) {
    const nome = ev.target.value.toUpperCase();

    this.nomeFilter = nome;
    this.filtroSubject.next(nome);
  }

  deleteDriver(id: number) {
    let confirm = window.confirm(
      `Tem certeza que quer deletar este motorista do id: ${id}?`
    );
    if (confirm) {
      this.carUserControlService.deleteDriver(id).subscribe({
        next: (res) => {
          alert('Motorista deletado!');
          this.getDriverList();
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
          this.getDriverList();
        }
      },
    });
  }
}
