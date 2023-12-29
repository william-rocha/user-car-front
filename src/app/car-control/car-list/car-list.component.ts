import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subject, debounceTime } from 'rxjs';
import { CarUserControlService } from '../service/car-user-control.service';
import { DialogComponent } from './dialog/dialog.component';

type CorMarcaFilter = {
  corMarca: string;
  valor: string;
};
@Component({
  selector: 'app-car-list',
  standalone: true,
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
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

  filtroCorMarca = {
    cor: '',
    marca: '',
  };
  marcaFilter = '';
  corFilter = '';

  private filtroSubject = new Subject<CorMarcaFilter>();

  constructor(
    private dialog: MatDialog,
    private carUserControlService: CarUserControlService
  ) {}

  ngOnInit(): void {
    this.getCarList();

    this.filtroSubject
      .pipe(debounceTime(1200)) // debounce gera intervalo para evitar de bater na api a cada clique no filter
      .subscribe((carFilter: CorMarcaFilter) => {
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
    this.carUserControlService.getCarList().subscribe({
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

  getCarListFilter({ corMarca, valor }: any): void {
    if ((corMarca = 'cor')) {
      this.filtroCorMarca = { ...this.filtroCorMarca, cor: valor };
    } else {
      this.filtroCorMarca = { ...this.filtroCorMarca, marca: valor };
    }
    this.carUserControlService
      .getCarListFiltered(this.filtroCorMarca)
      .subscribe({
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

  applyFilter(ev: any, corMarca: string) {
    const nome = ev.target.value.toUpperCase();
    if (corMarca == 'cor') {
      this.corFilter = nome;
    } else {
      this.marcaFilter = nome;
    }
    const corMarcaFilter = {
      corMarca: corMarca.toUpperCase(),
      valor: nome,
    };
    this.filtroSubject.next(corMarcaFilter);
  }

  deleteCar(id: number) {
    let confirm = window.confirm('Tem certeza que quer deletar este carro?');
    if (confirm) {
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
