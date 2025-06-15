import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  users: any[] = [];
  title = 'MeetYourMatch';
  httpclient = inject(HttpClient);
  ngOnInit(): void {
    this.httpclient.get<any[]>('https://localhost:5001/api/users').subscribe({
      next: response => this.users = response,
      error: error => console.error('Error fetching users:', error),
      complete: () => console.log('User data fetch complete')
    });
  }
}
