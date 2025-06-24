import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http: HttpClient = inject(HttpClient);
  baseUrl: string = environment.apiUrl + 'account/';
  currentUser: WritableSignal<User | null> = signal<User | null>(null);
  private likeService = inject(LikesService);


  public login(model: any): Observable<User> {
    console.log("service called with model", model);
    return this.http.post<User>(this.baseUrl + 'login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
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
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likeService.getLikeIds();
  }
  public logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
