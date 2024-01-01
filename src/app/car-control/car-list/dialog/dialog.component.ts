import { HttpClientModule } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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
  imports: [HttpClientModule, ReactiveFormsModule, MaterialModule],
})
export class DialogComponent {
  carForm: FormGroup;

  constructor(
    private carUserControlService: CarUserControlService,
    private dialogRef: MatDialogRef<DialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.carForm = this.formBuilder.group({
      placa: ['', Validators.required],
      cor: ['', Validators.required],
      marca: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.carForm.valid) {
      if (this.data) {
        this.updateCar();
      } else {
        this.saveCar();
      }
    }
  }
  updateCar() {
    this.carUserControlService
      .updateCar(this.data.id, this.carForm.value)
      .subscribe({
        next: (val: any) => {
          alert('Detalhes do carro foram atualizados!');
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro durante atualização de carro!');
        },
      });
  }

  saveCar() {
    this.carUserControlService.addCar(this.carForm.value).subscribe({
      next: (val: any) => {
        alert('Carro salvo com sucesso!');
        this.carForm.reset();
        this.dialogRef.close(true);
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao salvar carro!');
      },
    });
  }

  uppercaseInput(event: Event, campo: string): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value.toUpperCase();
    this.carForm.patchValue({ [campo]: inputValue });
  }
}
