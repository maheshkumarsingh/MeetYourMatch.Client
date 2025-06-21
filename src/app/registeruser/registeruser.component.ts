import { Component, inject, input, OnInit, output, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registeruser',
  imports: [FormsModule],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisteruserComponent implements OnInit {
  user: User = { userName: '', token: '' };
  // usersFromHomeComponent = input.required<User[]>();
  // cancelRegisterMode= output<boolean>();
  accountService = inject(AccountService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    // console.log("RegisteruserComponent initialized", this.usersFromHomeComponent);
  }
  register(){
    console.log("Registering user with the following data:", this.user);
    this.accountService.register(this.user).subscribe({
      next : response =>{
        this.toastr.success('Registration successful'); // Show success message
        this.user = response; // Update the user with the response
        this.cancel(); // Call cancel to reset the form and emit the event
      },
      error: error => {
        this.toastr.error(error.error); // Show error message
      },
    });
}

  cancel(){
    this.toastr.info('Registration cancelled'); // Show cancellation message
    this.user = { userName: '', token: '' }; // Reset the user
    // this.cancelRegisterMode.emit(false); // Emit the cancel event
  }
}
