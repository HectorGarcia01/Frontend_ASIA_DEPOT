import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http: HttpClient) { }

  getAddress(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  addCustomer(url: string, customer: any): Observable<any> {
    return this.http.post<any>(url, customer);
  }

  getCustomerProfile(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  updateCustomer(url: string, customer: any): Observable<any> {
    return this.http.put<any>(url, customer);
  }

  uploadProfilePhoto(url: string, avatar: any): Observable<any> {
    return this.http.post<any>(url, avatar);
  }

  deleteProfilePhoto(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }
}
