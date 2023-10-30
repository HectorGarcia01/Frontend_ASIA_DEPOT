import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  selectedFile: File | undefined;
  uploading: boolean = false;

  constructor(private userService: UserServicesService) { }

  ngOnInit(){
    
  }

  onUploadAvatar() {
    if (this.selectedFile) {
      // const formData = new FormData();
      // formData.append('avatar', this.selectedFile);

      this.uploading = true;
      this.userService.uploadProfilePhoto(`${apiURL}/usuario/subir/avatar`, this.selectedFile).subscribe(
        (response) => {
          alert("todo bien")
          this.uploading = false;
        },
        (error) => {
          alert(error.message)
          this.uploading = false;
        }
      );
    }
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }
}
