import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl + 'users/';
  private accountService = inject(AccountService);

  getMembers() : Observable<Member[]> {
    //return this.http.get<Member[]>(this.baseUrl, this.getHttpOptions());
    return this.http.get<Member[]>(this.baseUrl);
  }
  getMember(username:string): Observable<Member> {
    //return this.http.get<Member>(this.baseUrl + username, this.getHttpOptions());
    return this.http.get<Member>(this.baseUrl + username);
  }

  getHttpOptions(): {headers: HttpHeaders} {
    return{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      })
    };
  }
}
