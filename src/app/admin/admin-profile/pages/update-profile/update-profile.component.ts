import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminProfileService } from 'src/app/admin/services/admin-profile.service';
import { SharedService } from 'src/app/user/services/shared.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getEmployee, updateEmployee } from 'src/app/admin/interfaces/employee.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  employee: getEmployee = {} as getEmployee;
  updateForm!: FormGroup;
  image: any = 'assets/transparent.png';
  selectedFile: File | undefined;
  uploading: boolean = false;
  previewImage: string | ArrayBuffer | null = null;
  pathRole: any = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private adminService: AdminProfileService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) {
    this.validateForm();
  }

  /**
   * Función para verificar si es un SuperAdmin
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getCookieRole del servicio de autenticación (auth.service)
   */

  isSuperAdmin(): boolean {
    const userRole = this.authService.getCookieRole();

    if (userRole === 'SuperAdmin') {
      this.pathRole = 'superAdmin';
      return true;
    }

    this.pathRole = 'admin';
    return false;
  }

  ngOnInit() {
    this.scrollToTop();
    this.isSuperAdmin();
    this.viewProfile();
    this.getProfilePicture();
  }

  /**
   * Función para consumir el servicio de ver perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getEmployeeProfile del servicio de empleado (employee-management.service)   
   */

  viewProfile() {
    try {
      this.isSuperAdmin();
      this.adminService.getEmployeeProfile(`${apiURL}/${this.pathRole}/ver/perfil`).subscribe({
        next: (data: any) => {
          this.employee = data.employee;
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
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
      nit: new FormControl('', [Validators.pattern('^[0-9]+$')])
    });
  }

  /**
   * Función para obtener todos los datos del formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getUserData() {
    const employee: updateEmployee = {
      Nombre_Empleado: this.updateForm.get('nombre')?.value,
      Apellido_Empleado: this.updateForm.get('apellido')?.value,
      Telefono_Empleado: this.updateForm.get('telefono')?.value,
      NIT_Empleado: this.updateForm.get('nit')?.value
    };

    for (const key in employee) {
      if (employee.hasOwnProperty(key) && (employee[key] === null || employee[key] === undefined || employee[key] === '')) {
        delete employee[key];
      }
    }

    if (Object.keys(employee).length === 0) {
      return null;
    }

    return employee;
  }

  /**
   * Función para consumir el servicio de actualización de datos del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función updateCustomer del servicio de usuario (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      if (this.updateForm.valid) {
        const userData = this.getUserData();
        
        if (userData) {
          this.adminService.updateEmployee(`${apiURL}/${this.pathRole}/actualizar/perfil`, userData).subscribe({
            next: (response: any) => {
              this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
              this.updateForm.reset();
              this.router.navigate(['/admin/profile']);
            },
            error: (error: any) => {
              this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
            }
          });
        } else {
          this.customAlertService.sweetAlertPersonalizada('success', "Sin cambios", "No has realizado ningún cambio.");
          this.router.navigate(['/admin/profile']);
        }
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para ver la foto de perfil del admin o superAdmin
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProfilePhoto() del servicio de usuario (admin-profile.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  getProfilePicture() {
    try {
      this.isSuperAdmin();
      this.adminService.getProfilePhoto(`${apiURL}/${this.pathRole}/ver/avatar`).subscribe({
        next: (data: Blob) => {
          this.image = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.image = 'assets/perfil_picture.png';
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio para subir foto de perfil 
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función uploadProfilePhoto del servicio de usuario (admin-profile-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onUploadAvatar() {
    try {
      if (this.selectedFile) {
        this.uploading = true;
        this.loading = true;
        this.isSuperAdmin();
        this.adminService.uploadProfilePhoto(`${apiURL}/${this.pathRole}/subir/avatar`, this.selectedFile).subscribe({
          next: (response: any) => {
            this.uploading = false;
            this.loading = false;
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.router.navigate(['admin/profile']);
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
          const reader = new FileReader();

          reader.onload = (e) => {
            this.previewImage = e.target?.result as string;
          };

          reader.readAsDataURL(selectedFile);
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
