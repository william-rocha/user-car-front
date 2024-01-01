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
  imports: [ReactiveFormsModule, HttpClientModule, MaterialModule],
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
