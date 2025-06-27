import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../_models/member';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../_services/likes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent {
  private likeService = inject(LikesService);
  member = input.required<Member>();
  hasLiked = computed(()=> this.likeService.likeIds().includes(this.member().id));
  private toastr = inject(ToastrService);


  toggleLike(){
    this.likeService.toggleLike(this.member().id).subscribe({
      next:()=>{
        if(this.hasLiked()){
          this.likeService.likeIds.update(ids => ids.filter(x=> x!==this.member().id));
          this.toastr.warning('User has been unliked!');
        }else{
          this.likeService.likeIds.update(ids => [...ids, this.member().id]);
          this.toastr.success('User has been liked!');
        }
      }
    })
  }

}
