import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from "ngx-timeago";
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../_models/message';
import { MessagesService } from '../../_services/messages.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnectionState } from '@microsoft/signalr';

@Component({
  selector: 'app-member-detail',
  imports: [DatePipe, TabsModule, GalleryModule, TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
  presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToastrService);
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  //messages: Message[] = [];
  private messageService = inject(MessagesService);
  private accountService = inject(AccountService);
  private router = inject(Router);

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(photo => {
          this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
        })
      }
    })

    this.route.paramMap.subscribe({
      next: _ => this.onRouteParamsChange()
    })
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  // onUpdateMessages(event: Message) {
  //   this.messages.push(event);
  // }
  
  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onRouteParamsChange(){
    const user = this.accountService.currentUser();
    if(!user)
      return;
    if(this.messageService.hubsConnection?.state === HubConnectionState.Connected && this.activeTab?.heading === 'Messages')
    {
      this.messageService.hubsConnection.stop().then(()=>{
        this.messageService.createHubConnection(user, this.member.userName);
      });
    }
  }
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams:{tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    });

    if (this.activeTab.heading === 'Messages' && this.member) {
      const user = this.accountService.currentUser();
      if(!user)
        return;
      this.messageService.createHubConnection(user, this.member.userName);
    }else{
      this.messageService.stopHubConnection();
    }
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
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
