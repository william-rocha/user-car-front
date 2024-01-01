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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { CarUserControlService } from '../../service/car-user-control.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    CommonModule,
    MaterialModule,
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
