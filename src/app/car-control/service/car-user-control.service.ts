import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Car {
  id?: number;
  placa: string;
  cor: string;
  marca: string;
}

export interface Driver {
  id?: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarUserControlService {
  baseUrl: string = 'http://localhost:3000/';

  constructor(private httpClient: HttpClient) {}

  addCar(data: Car): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'carro', data);
  }

  updateCar(id: number, data: Car): Observable<any> {
    return this.httpClient.put(this.baseUrl + `carro/${id}`, data);
  }

  getCarList(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.baseUrl + 'carro');
  }

  getCarsAvailable(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.baseUrl + 'carro/disponivel');
  }

  deleteCar(id: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + `carro/${id}`);
  }

  getCarListFiltered({
    cor,
    marca,
  }: {
    cor?: string;
    marca?: string;
  }): Observable<Car[]> {
    return this.httpClient.get<Car[]>(
      this.baseUrl + `carro/filter?cor=${cor}&marca=${marca}`
    );
  }

  // MOTORISTA

  addDriver(data: Driver): Observable<any> {
    return this.httpClient.post(this.baseUrl + 'motorista', data);
  }

  updateDriver(id: number, data: Driver): Observable<any> {
    return this.httpClient.patch(this.baseUrl + `motorista/${id}`, data);
  }

  getDriverList(): Observable<Driver[]> {
    return this.httpClient.get<Driver[]>(this.baseUrl + 'motorista');
  }

  getDriversAvailable(): Observable<Car[]> {
    return this.httpClient.get<Car[]>(this.baseUrl + 'motorista/disponivel');
  }

  getDriverById(id: number): Observable<Driver> {
    return this.httpClient.get<Driver>(this.baseUrl + `motorista/${id}`);
  }

  deleteDriver(id: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + `motorista/${id}`);
  }

  getDriversByNome(
    nome: string,
    size: number,
    page: number
  ): Observable<Driver[]> {
    return this.httpClient.get<Driver[]>(
      this.baseUrl +
        `motorista/page/filter?nome=${nome}&page=${page}&size=${size}`
    );
  }

  // CAR USERS

  addCarUsage(data: any) {
    return this.httpClient.post(this.baseUrl + 'carro-usuario', data);
  }

  finishCarUsage(rowId: number): Observable<any> {
    return this.httpClient.patch(
      this.baseUrl + `carro-usuario/finalizar/${rowId}`,
      {
        id: rowId,
      }
    );
  }

  getCarUsages(cor: string = '', marca: string = ''): Observable<any[]> {
    return this.httpClient.get<any[]>(this.baseUrl + 'carro-usuario');
  }
  deleteCarUser(id: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + `carro-usuario/${id}`);
  }
}
