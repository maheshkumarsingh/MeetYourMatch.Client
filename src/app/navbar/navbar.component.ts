import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  model:any = {}; //[] is an array, {} is an object
  // loggedIn: boolean = false;
  public accountservice:AccountService = inject(AccountService);
  public router = inject(Router);
  public toastr = inject(ToastrService);
  login(){
    console.log("login called with model", this.model);
    this.accountservice.login(this.model).subscribe({
      next: _ => {
        this.toastr.success('Logged in successfully'); // Show success message
        this.router.navigateByUrl('/members'); // Navigate to members page after login
      },
      error:(error)=>{
        this.toastr.error(error.error); // Show error message
        console.log(error);
      },
      complete:()=>{}
    });
  }

  logout(){
    this.accountservice.logout();
    this.toastr.info('Logged out successfully'); // Show logout message
    this.router.navigateByUrl('/'); // Navigate to home page after logout
  }
}
