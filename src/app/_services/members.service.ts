import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { Observable, of, tap } from 'rxjs';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl + 'users/';
  private accountService = inject(AccountService);
  members = signal<Member[]>([]);

  getMembers() {
    //return this.http.get<Member[]>(this.baseUrl, this.getHttpOptions());
    return this.http.get<Member[]>(this.baseUrl).subscribe({
      next:members=> this.members.set(members)
    });
  }
  getMember(username:string): Observable<Member> {
    const member = this.members().find(x => x.userName === username);
    if(member!=undefined)
        return of(member);
    //return this.http.get<Member>(this.baseUrl + username, this.getHttpOptions());
    return this.http.get<Member>(this.baseUrl + username);
  }
  updateMember(member:Member): Observable<Member> {
    //return this.http.put<Member>(this.baseUrl + member.username, member, this.getHttpOptions());
    return this.http.put<Member>(this.baseUrl, member).pipe(
      tap(()=>{
        this.members.update(members => 
          members.map(
            m => m.userName === member.userName ? member :m))
      })
    );
  }
  getHttpOptions(): {headers: HttpHeaders} {
    return{
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      })
    };
  }
}
