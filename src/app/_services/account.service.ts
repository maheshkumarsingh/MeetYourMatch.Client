import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = 'https://localhost:5001/api/v1/account/';
  currentUser: WritableSignal<User | null> = signal<User | null>(null);

  public login(model: any): Observable<User> {
    console.log("service called with model", model);
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }
  public register(model: any): Observable<User> {
    console.log("service called with model", model);
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }
  public logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
