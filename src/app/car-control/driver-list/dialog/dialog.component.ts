import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CarUserControlService } from '../../service/car-user-control.service';

interface Motorista {
  createdAt?: string;
  id?: number;
  nome: string;
  status?: string;
  updatedAt?: string;
}
@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class DialogComponent {
  motoristaForm: FormGroup;

  constructor(
    private carUserControlService: CarUserControlService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.motoristaForm = this.formBuilder.group({
      id: [''],
      nome: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.motoristaForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.motoristaForm.valid) {
      if (this.data) {
        this.updateDriver();
      } else {
        this.saveDriver();
      }
    }
  }

  updateDriver() {
    this.carUserControlService
      .updateDriver(this.data.id, this.motoristaForm.value)
      .subscribe({
        next: (val: any) => {
          alert('Detalhes do Motorista foram atualizados!');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro durante atualização de Motorista!');
        },
      });
  }

  saveDriver() {
    this.carUserControlService.addDriver(this.motoristaForm.value).subscribe({
      next: (val: Motorista) => {
        debugger;
        alert(`Motorista ${val.nome} adicionado com sucesso!`);
        this.motoristaForm.reset();
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao adicionar motorista!');
      },
    });
  }

  uppercaseInput(event: Event, campo: string): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.toUpperCase();
    this.motoristaForm.patchValue({ [campo]: inputValue });
  }
}
