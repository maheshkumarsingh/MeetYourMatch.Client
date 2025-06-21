import { Component, inject, OnInit, Pipe } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-detail',
  imports: [DatePipe, TabsModule, GalleryModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  private toaster = inject(ToastrService);
  member?: Member;
  images:GalleryItem[] = [];

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    if (username) {
      this.memberService.getMember(username).subscribe({
        next: (member) => {
          this.member = member;
          member.photos.map(photo =>{
            this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))
          })
          this.toaster.success(`Loaded member: ${member.userName}`);
        },
        error: error => {
          console.error('Error loading member:', error);
          this.toaster.error('Failed to load member details');
        }
      });
    }
  }
}
