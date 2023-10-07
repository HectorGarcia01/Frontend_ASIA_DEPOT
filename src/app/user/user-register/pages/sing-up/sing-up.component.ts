import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { Department, Municipalities } from 'src/app/user/interfaces/address.interface';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {
  registerForm!: FormGroup;
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;
  selectedMunicipalityId: number | null = null;
  municipalities: Municipalities[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UserServicesService
  ) { 
    this.validateForm();
  }

  ngOnInit() {
    this.getAddresses();
  }

  getAddresses() {
    this.userService.getAddress('http://localhost:3000/usuario/ver/direcciones').subscribe((data: any) => {
      this.departments = data.address;
    });
  }

  onDepartmentSelected(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      this.selectedDepartmentId = Number(selectedValue);
      const selectedDepartment = this.departments.find(department => department.id === this.selectedDepartmentId);
      if (selectedDepartment) {
        this.municipalities = selectedDepartment.municipios;
      } else {
        this.municipalities = [];
      }
    } else {
      this.municipalities = [];
    }
    this.registerForm.get('municipio')?.setValue(null);
  }

  private validateForm() {
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^[345][0-9]{7}$/)]),
      nit: new FormControl(''),
      direccion: new FormControl('', [Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(100)]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s).*$/), Validators.minLength(8), Validators.maxLength(25)]),
      repetir_password: new FormControl('', [Validators.required]),
      departamento: new FormControl(null),
      municipio: new FormControl(null)
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repetir_password')?.value;

    if (password === repeatPassword) {
      return null;
    } else {
      return { passwordsNotMatch: true };
    }
  }

  onSubmit() {

  }
} 