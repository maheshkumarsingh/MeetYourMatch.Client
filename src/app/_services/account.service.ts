import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http: HttpClient = inject(HttpClient);
  private likeService = inject(LikesService);
  baseUrl: string = environment.apiUrl + 'account/';
  currentUser: WritableSignal<User | null> = signal<User | null>(null);
  presenceService = inject(PresenceService);


  roles = computed(()=> {
    const user = this.currentUser();
    if(user && user.token){
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role)?role:[role];
    }
    return [];
  })

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
    this.presenceService.createHubConnection(user);
  }
  public logout(): void {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }
}
