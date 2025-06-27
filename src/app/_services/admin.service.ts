import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl+'admin/';
  private http = inject(HttpClient);

  getUserRole(){
    return this.http.get<User[]>(this.baseUrl+'users-with-roles');
  }
  updateUserRoles(username:string, roles:string[]){
    return this.http.post<string[]>(this.baseUrl+'edit-roles/'+username+'?roles='+roles,{});
  }
}
