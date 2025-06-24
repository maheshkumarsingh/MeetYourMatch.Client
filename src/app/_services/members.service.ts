import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { Observable, of, tap } from 'rxjs';
import { AccountService } from './account.service';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { ToastrService } from 'ngx-toastr';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl + 'users/';
  private accountService = inject(AccountService);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  toastr = inject(ToastrService);
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams(){
    this.userParams.set(new UserParams(this.user));
  }

  getMembers() {

    const response = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if (response) {
      this.toastr.info('Members from cache :)');
      return setPaginatedResponse(response,this.paginatedResult);
    }
    //return this.http.get<Member[]>(this.baseUrl, this.getHttpOptions());
    let params = setPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxPage', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<Member[]>(this.baseUrl, { observe: 'response', params }).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'), response);
      }
    });
  }
  getMember(username: string): Observable<Member> {
    // const member = this.members().find(x => x.userName === username);
    // if (member != undefined)
    //   return of(member);
    //return this.http.get<Member>(this.baseUrl + username, this.getHttpOptions());
    const member:Member = [...this.memberCache.values()]
                    .reduce((arr, elem) => arr.concat(elem.body), [])
                    .find((m:Member) => m.userName === username)
    if(member)
      return of(member);
    return this.http.get<Member>(this.baseUrl + username);
  }
  updateMember(member: Member): Observable<Member> {
    //return this.http.put<Member>(this.baseUrl + member.username, member, this.getHttpOptions());
    return this.http.put<Member>(this.baseUrl, member).pipe(
      // tap(() => {
      //   this.members.update(members =>
      //     members.map(
      //       m => m.userName === member.userName ? member : m))
      // })
    );
  }
  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + 'set-main-photo/' + photo.id, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photoURL = photo.url;
      //     }
      //     return m;
      //   }));
      // })
    );
  }
  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'delete-photo/' + photo.id, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members.map(m => {
      //     if (m.photos.includes(photo)) {
      //       m.photos = m.photos.filter(x => x.id === photo.id)
      //     }
      //     return m;
      //   }));
      // })
    );

  }
  getHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      })
    };
  }
}
