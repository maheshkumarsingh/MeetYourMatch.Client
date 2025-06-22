import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../_models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PhotoEditComponent } from "../photo-edit/photo-edit.component";

@Component({
  selector: 'app-member-edit',
  imports: [TabsModule, DatePipe, FormsModule, PhotoEditComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit{
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any){
    $event.returnValue = true;
  }
  unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  accountService = inject(AccountService);
  memberService = inject(MembersService);
  route = inject(Router);
  toastr = inject(ToastrService);
  member?: Member;
  ngOnInit(): void {
    this.toastr.info('Edit your profile here', 'Profile Edit');
    this.loadMember();
  }
  loadMember(){
    const user = this.accountService.currentUser();
    //console.log('Current User:', user);
    if(user){
      this.memberService.getMember(user!.userName).subscribe({
        next: (response) =>{
          this.member = response;
          this.toastr.success('Member data loaded successfully', 'Load Member');
        },
        error: (error) => {
          this.toastr.error('Failed to load member data', 'Load Member Error');
          console.error(error);
        }
      });
    }
    else{
      this.toastr.error('this.accountService.currentUser()')
    }
  }

  updateMember(){
    //console.log('Updating member:', this.member);
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next:_=>{
        this.toastr.success('Member data updated successfully', 'Update Member');
        this.editForm?.reset(this.member);
      },
      error:(error) =>{
        this.toastr.error('Failed to update member data', 'Update Member Error');
        console.error(error);
      }
    });
  }

  onMemberChange(event:Member)
  {
    this.member = event;
  }
}
