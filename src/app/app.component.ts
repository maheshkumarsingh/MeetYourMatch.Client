import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { AccountService } from './_services/account.service';
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./footer/footer.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  accountservice = inject(AccountService);
  
  ngOnInit(): void {
    this.setCurrentUser();
  }

  // ngOnInit() {
  // if (this.accountService.currentUser()) {
  //   this.router.navigateByUrl('/members');
  // }
//}
  setCurrentUser() : void{
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    this.accountservice.setCurrentUser(user);
  }
}
