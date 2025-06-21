import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
  selector: 'app-member-list',
  imports: [MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  memberService = inject(MembersService);
  members:Member[] = [];
  toastr = inject(ToastrService);
  
  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers():void{
    this.memberService.getMembers().subscribe({
      next:(response : Member[])=>{
        this.members = response;
        this.toastr.success('Members loaded successfully');
      },
      error:(error)=>{
        this.toastr.error('Failed to load members');
        console.error(error);
      }
    });
  }
}
