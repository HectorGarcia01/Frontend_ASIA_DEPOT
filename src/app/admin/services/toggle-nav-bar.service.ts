import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleNavBarService {
  private sidebarVisibility = new BehaviorSubject<boolean>(false);
  sidebarVisibility$ = this.sidebarVisibility.asObservable();

  constructor() { }


  setSidebarVisibility(isVisible: boolean) {
    this.sidebarVisibility.next(isVisible);
  }
}
