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
  toastr = inject(ToastrService);
  
  ngOnInit(): void {
    if(this.memberService.members.length===0)
      this.loadMembers();
  }
  loadMembers():void{
    this.memberService.getMembers();
    this.toastr.success('Members loaded successfully.')
  }
}
