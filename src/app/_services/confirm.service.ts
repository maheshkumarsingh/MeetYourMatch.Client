import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);

  confirm(
    title: string,
    message: string,
    btnOkText: string,
    btnCancelText: string

        // title:'Confirmation',
        // message:'Are you sure you want to continue? Any unsaved changes will be lost.',
        // btnOkText:'Yes',
        // btnCancelText:'No',
  )
  {
    const config: ModalOptions ={
      initialState:{
        title,
        message,
        btnOkText,
        btnCancelText,
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
    return this.bsModalRef.onHidden?.pipe(
      map(()=>{
        if(this.bsModalRef?.content){
          return this.bsModalRef.content.result;
        }else{
          return false;
        }
      })
    )
  }
}
