import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Department, Municipalities } from 'src/app/user/interfaces/address.interface';
import { updateCustomer } from 'src/app/user/interfaces/customer.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  updateForm!: FormGroup;
  departments: Department[] = [];
  selectedDepartmentId: number | null = null;
  selectedMunicipalityId: number | null = null;
  municipalities: Municipalities[] = [];
  image: any;
  selectedFile: File | undefined;
  uploading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserServicesService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) { 
    this.validateForm(); 
  }

  ngOnInit() {
    this.scrollToTop();
    this.getProfilePicture();
    this.getAddresses();
  }

  /**
   * Función para consumir el servicio de ver la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función isAuthenticated del servicio de autenticación (auth.service),
   *            Función getProfilePhoto del servicio de usuarios (user-services.service)   
   */

  getProfilePicture() {
    try {
      if (this.authService.isAuthenticated()) {
        this.userService.getProfilePhoto(`${apiURL}/usuario/ver/avatar`).subscribe({
          next: (data: Blob) => {
            this.image = URL.createObjectURL(data);
          },
          error: (error: any) => {
            this.image = 'assets/perfil_picture.png';
          }
        })
      } else {
        this.image = 'assets/perfil_picture.png';
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de de listar las direcciones
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *              Función getAddress del servicio de usuario (user-services.service)
   */

  getAddresses() {
    this.userService.getAddress(`${apiURL}/usuario/ver/direcciones`).subscribe((data: any) => {
      this.departments = data.address;
    });
  }

  /**
   * Función para capturar el departamento seleccionado y así listar sus municipios
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

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
    this.updateForm.get('municipio')?.setValue(null);
  }

  /**
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.updateForm = new FormGroup({
      nombre: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      telefono: new FormControl('', [Validators.pattern(/^[345][0-9]{7}$/)]),
      nit: new FormControl('', [Validators.pattern('^[0-9]+$')]),
      direccion: new FormControl('', [Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(100)]),
      departamento: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
      municipio: new FormControl(null, [Validators.pattern('^[0-9]+$')])
    });
  }

  /**
   * Función para obtener todos los datos del formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getUserData() {
    const customer: updateCustomer = {
      Nombre_Cliente: this.updateForm.get('nombre')?.value,
      Apellido_Cliente: this.updateForm.get('apellido')?.value,
      Telefono_Cliente: this.updateForm.get('telefono')?.value,
      NIT_Cliente: this.updateForm.get('nit')?.value,
      Direccion_General: this.updateForm.get('direccion')?.value,
      ID_Departamento_FK: this.updateForm.get('departamento')?.value,
      ID_Municipio_FK: this.updateForm.get('municipio')?.value,
    };

    for (const key in customer) {
      if (customer.hasOwnProperty(key) && (customer[key] === null || customer[key] === undefined || customer[key] === '')) {
        delete customer[key];
      }
    }

    if (Object.keys(customer).length === 0) {
      return null;
    }

    return customer;
  }

  /**
   * Función para consumir el servicio de actualización de datos del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getAddress del servicio de usuario (user-services.service)
   */

  onSubmit() {
    try {
      if (this.updateForm.valid) {
        const userData = this.getUserData();

        if (userData?.ID_Departamento_FK && !userData?.ID_Municipio_FK) {
          return this.customAlertService.sweetAlertPersonalizada('error', "Datos incompletos", "Debes escoger un municipio.");
        }

        if (!userData) {
          this.customAlertService.sweetAlertPersonalizada('success', "Sin cambios", "No has realizado ningún cambio.");
          return this.router.navigate(['/profile']);
        }

        this.userService.updateCustomer(`${apiURL}/usuario/actualizar/perfil`, userData).subscribe({
          next: (response: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.updateForm.reset();
            this.router.navigate(['/profile']);
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  onUploadAvatar() {
    try {
      if (this.selectedFile) {
        this.uploading = true;
        this.userService.uploadProfilePhoto(`${apiURL}/usuario/subir/avatar`, this.selectedFile).subscribe({
          next: (response: any) => {
            this.uploading = false;
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.router.navigate(['/profile']);
          },
          error: (error: any) => {
            this.uploading = false;
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Imágen no seleccionada", "Por favor selecciona una imágen.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension) {
        const allowedExtensions = ['jpg', 'jpeg', 'png'];

        if (allowedExtensions.includes(fileExtension)) {
          this.selectedFile = selectedFile;
        } else {
          this.customAlertService.sweetAlertPersonalizada('error', "Archivo no válido", "Selecciona un archivo con una extensión válida (.jpg, .jpeg o .png).");
        }
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Archivo no válido", "No se pudo determinar la extensión del archivo.");
      }
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
