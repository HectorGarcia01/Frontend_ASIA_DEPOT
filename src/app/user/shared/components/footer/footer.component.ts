import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/user/services/category.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { NewsletterService } from 'src/app/user/services/newsletter.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Category, Categories } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  newsletterForm!: FormGroup;
  category: Category[] = [];
  categories: Categories[] = [];
  categoriesPerColumn!: number;
  loading = false;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private newsletterService: NewsletterService,
    private customAlertService: CustomAlertService
  ) { 
    this.validateForm();
  }

  ngOnInit() {
    this.getCategories();
  }

  /**
   * Función para consumir el servicio de de listar categorías
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories del servicio de categoría (category.service)
   */

  getCategories() {
    this.categoryService.getCategories(`${apiURL}/usuario/ver/categorias`).subscribe((data: any) => {
      this.category = data.categories;
      this.categoriesPerColumn = Math.ceil(this.category.length / 3);
    });
  }

  /**
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.newsletterForm = new FormGroup({
      newsletterEmail: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)])
    });
  }

  /**
   * Función para consumir el servicio de suscripción del newsletter
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getAddress del servicio de usuario (user-services.service)
   */

  onSubmit() {
    try {
      if (!this.authService.isAuthenticated()){
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para poder suscribirte al newsletter primero debes de iniciar sesión.");
      }

      if (this.newsletterForm.valid) {
        this.loading = true;
        const userData = { Correo_Cliente: this.newsletterForm.get('newsletterEmail')?.value };

        this.newsletterService.subscriptionNewsletter(`${apiURL}/usuario/suscripcion/newsletter`, userData).subscribe({
          next: (response: any) => {
            this.loading = false;
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
          },
          error: (error: any) => {
            if (error.status === 400) {
              this.customAlertService.sweetAlertPersonalizada('error', "¡Ya eres un suscriptor! ", error.error.error);
            }
          }
        })
      } else {
        if (this.newsletterForm.get('newsletterEmail')?.hasError('required')) {
          this.customAlertService.sweetAlertPersonalizada('error', "Campo vacío", "El campo de correo es obligatorio.");
        } else if (this.newsletterForm.get('newsletterEmail')?.hasError('email')) {
          this.customAlertService.sweetAlertPersonalizada('error', "Correo inválido", "Por favor, ingresa un correo válido.");
        }
      }
      this.newsletterForm.reset();
    } catch (error: any) {
      console.log(error.error);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }
}
