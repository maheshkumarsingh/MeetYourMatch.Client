import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit{
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService);
  bsModalRef:BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  users:User[]=[];
  private modalService =  inject(BsModalService);
  
  ngOnInit(): void {
    this.adminService.getUserRole().subscribe({
      next:users =>{
        this.users = users;
        this.toastr.info('user with roles loaded');
      }
    })
  }
  openRolesModal(user:User){
    const initialState:ModalOptions={
      class: 'modal-lg',
      initialState:{
        title: 'User Roles',
        username:user.userName,
        selectedRoles:[...user.roles],
        availableRoles:['Admin', 'Moderator','Member'],
        users:this.users,
        rolesUpdated:false
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () =>{
        if(this.bsModalRef.content && this.bsModalRef.content.rolesUpdated){
          const selectedRoles = this.bsModalRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.userName, selectedRoles).subscribe({
            next: roles => user.roles = roles
          })
        }
      }
    })
  }

}
