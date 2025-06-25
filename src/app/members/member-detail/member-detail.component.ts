import { Component, inject, OnInit, Pipe, ViewChild, viewChild } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from "ngx-timeago";
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../_models/message';
import { MessagesService } from '../../_services/messages.service';

@Component({
  selector: 'app-member-detail',
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToastrService);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  private messageService = inject(MessagesService);

  ngOnInit(): void {
    this.route.data.subscribe({
      next:data=>{
        this.member = data['member'];
        this.member && this.member.photos.map(photo => {
            this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
          })
      }
    })
    this.route.queryParams.subscribe({
      next: params=>{
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  onUpdateMessages(event:Message)
  {
    this.messages.push(event);
  }
  selectTab(heading:string){
    if(this.memberTabs)
    {
      const messageTab = this.memberTabs.tabs.find(x=> x.heading === heading);
      if(messageTab)
      {
        messageTab.active = true;
      }
    }
  }
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) 
      {
        this.messageService.getMessagesThread(this.member.userName).subscribe({
        next: messages => this.messages = messages
        });
      }
}

  // loadMember() {
  //   const username = this.route.snapshot.paramMap.get('username');
  //   if (!username) return;
  //   if (username) {
  //     this.memberService.getMember(username).subscribe({
  //       next: (member) => {
  //         this.member = member;
  //         member.photos.map(photo => {
  //           this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
  //         })
  //         this.toaster.success(`Loaded member: ${member.userName}`);
  //       },
  //       error: error => {
  //         console.error('Error loading member:', error);
  //         this.toaster.error('Failed to load member details');
  //       }
  //     });
  //   }
  // }
}
