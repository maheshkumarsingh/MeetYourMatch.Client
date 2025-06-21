import { Component, inject, OnInit } from '@angular/core';
import { RegisteruserComponent } from "../registeruser/registeruser.component";
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [RegisteruserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.getUsers();
  }
  registerMode: boolean = false;
  httpclient = inject(HttpClient);
  users: User[] = [];


  getUsers(): void {
    this.httpclient.get<User[]>('https://localhost:5001/api/v1/users').subscribe({
      next: response => this.users = response,
      error: error => console.error('Error fetching users:', error),
      complete: () => console.log('User data fetch complete')
    });
  }
  tooggleRegisterMode(): void {
    this.registerMode = !this.registerMode;
  }
  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }
}
