import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  model:any = {}; //[] is an array, {} is an object
  // loggedIn: boolean = false;
  public accountservice:AccountService = inject(AccountService);


  login(){
    console.log("login called with model", this.model);
    this.accountservice.login(this.model).subscribe({
      next: response => {
        console.log("response", response);
        this.model.userName = response.userName;
      },
      error:(error)=>{
        console.log(error);
      },
      complete:()=>{
        console.log("model", this.model);
      }
    });
  }

  logout(){
    this.accountservice.logout();
    console.log("logout called");
  }
}
