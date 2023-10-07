import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { Department, Municipalities } from 'src/app/user/interfaces/address.interface';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {
  // registerForm: FormGroup;
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;
  selectedMunicipalityId: number | null = null;
  municipalities: Municipalities[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UserServicesService
  ) { this.selectedDepartmentId = null; }

  ngOnInit() {
    this.getAddresses();
  }

  getAddresses() {
    this.userService.getAddress('http://localhost:3000/usuario/ver/direcciones').subscribe((data: any) => {
      this.departments = data.address;
    });
  }

  onDepartmentSelected() {
    if (this.selectedDepartmentId !== null) {
      this.selectedDepartmentId = Number(this.selectedDepartmentId);
      const selectedDepartment = this.departments.find(department => department.id === this.selectedDepartmentId);
      if (selectedDepartment) {
        this.municipalities = selectedDepartment.municipios;
      } else {
        this.municipalities = [];
      }
    } else {
      this.municipalities = [];
    }
  }

  onSubmit() {

  }
} 