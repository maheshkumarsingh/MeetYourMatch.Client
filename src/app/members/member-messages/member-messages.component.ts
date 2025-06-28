import { Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { Message } from '../../_models/message';
import { MessagesService } from '../../_services/messages.service';
import { ToastrService } from 'ngx-toastr';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent{
  @ViewChild('messageForm') messageForm?: NgForm;
  messagesService = inject(MessagesService);
  userName = input.required<string>();
  //messages = input.required<Message[]>();
  toastr = inject(ToastrService);
  messageContent:string ='';
//updateMessages = output<Message>();

  sendMessage(){
    this.messagesService.sendMessage(this.userName(), this.messageContent).then(()=>{
      this.messageForm?.reset();
    })
    // this.messagesService.sendMessage(this.userName(), this.messageContent).subscribe({
    //   next:message=>{
    //     //this.updateMessages.emit(message);
    //     this.messageForm?.reset();
    //   }
    // })
  }
}
