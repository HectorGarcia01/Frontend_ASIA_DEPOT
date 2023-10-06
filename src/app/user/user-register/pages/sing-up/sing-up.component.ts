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
  municipalities: Municipalities[] = [];
  departmentSelectId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserServicesService
  ) { }

    ngOnInit() {
      // this.registerForm = this.fb.group({
      //   nombre: ['', Validators.required],
      //   apellido: ['', Validators.required],
      //   telefono: ['', Validators.required],
      //   nit: ['', Validators.required],
      //   departamento: [null, Validators.required],
      //   municipio: [null, Validators.required],
      //   direccion: ['', Validators.required],
      //   correo: ['', [Validators.required, Validators.email]],
      //   password: ['', [Validators.required, Validators.minLength(6)]],
      //   repeatPassword: ['', Validators.required]
      // });

      this.userService.getAddress('http://18.216.63.42:3000/usuario/ver/direcciones').subscribe((data: any) => {
        this.departments = data.address;
        console.log(this.departments);
        console.log(this.departments[0].nombre_departamento, this.departments[0].municipios[0].nombre_municipio);
      });
    }

    DepartmentSelected(departmentId: number | null) {
      const departmentSelected = this.departments.find(department => department.id === departmentId);
      this.municipalities = departmentSelected ? departmentSelected.municipios : [];
    }

    onSubmit() {

    }
} 