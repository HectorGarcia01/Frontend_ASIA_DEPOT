import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivateAccountService {

  constructor(
    private http: HttpClient
    ) { }

  /**
   * Función para realizar una solicitud post para activar la cuenta de usuario
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  activateAccount(url: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, null, { headers });
  }
}
