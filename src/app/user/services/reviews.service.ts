import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Función para realizar una solicitud post para agregar una nueva reseña
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  addReview(url: string, body: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, body, { headers });
  }

  /**
   * Función para realizar una solicitud get para listar todas las reseñas de un producto
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getReviews(url: string, id: string) {
    url = `${url}/${id}`;

    return this.http.get(url);
  }

  /**
   * Función para realizar una solicitud get para listar todas las reseñas
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getAllReviews(url: string) {
    return this.http.get(url);
  }
}
