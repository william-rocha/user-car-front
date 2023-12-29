import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CarUserControlService } from '../../service/car-user-control.service';

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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    AsyncPipe,
    CommonModule,
  ],
})
export class DialogComponent {
  carUserForm: FormGroup;

  selectedValueCar!: string;
  selectedValueDriver!: string;

  carrosLiberados: any;
  motoristaDisponiveis: any;

  constructor(
    private carUserControlService: CarUserControlService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.carUserForm = this.formBuilder.group({
      motivoUtilizacao: ['', Validators.required],
      motoristaId: ['', Validators.required],
      carroId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carrosLiberados = this.getCarsAvailable();
    this.motoristaDisponiveis = this.getDriverAvailable();
  }

  onSubmit() {
    console.log(this.carUserForm.value);

    if (this.carUserForm.valid) {
      this.saveCarUser();
    }
  }

  saveCarUser() {
    const carUser = this.carUserForm.value;

    const carDto = {
      carId: carUser.carroId,
      driverId: carUser.motoristaId,
      motivoUtilizacao: carUser.motivoUtilizacao,
    };

    this.carUserControlService.addCarUsage(carDto).subscribe({
      next: (val: any) => {
        alert('Relação de carro em  uso salva com sucesso!');
        this.carUserForm.reset();
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
        alert(
          `Erro ao salvar relação de carro em uso! ${err.error.message || ''}`
        );
      },
    });
  }

  getCarsAvailable() {
    return this.carUserControlService.getCarsAvailable();
  }

  getDriverAvailable() {
    return this.carUserControlService.getDriversAvailable();
  }
}
