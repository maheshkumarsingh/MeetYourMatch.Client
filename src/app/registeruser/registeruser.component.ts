import { Component, inject, input, OnInit, output, } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";

@Component({
  selector: 'app-registeruser',
  imports: [ReactiveFormsModule, JsonPipe, NgIf, TextInputComponent],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisteruserComponent implements OnInit {
  user: User = { userName: '', token: '' };
  // usersFromHomeComponent = input.required<User[]>();
  // cancelRegisterMode= output<boolean>();
  registerUserForm : FormGroup= new FormGroup({});
  accountService = inject(AccountService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    // console.log("RegisteruserComponent initialized", this.usersFromHomeComponent);
    this.initializeRegisterForm();
  }
  initializeRegisterForm(){
    this.registerUserForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      password: new FormControl('',[Validators.required,Validators.minLength(4), Validators.maxLength(12)]),
      confirmPassword: new FormControl('',[Validators.required, this.matchPasswordValues('password')]),
    })
    this.registerUserForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerUserForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }
  matchPasswordValues(matchTo:string):ValidatorFn{
    return (control:AbstractControl)=>{
      return control.value === control.parent?.get(matchTo)?.value?null:{ismatching:true};
    }
  }
  register(){
    console.log(this.registerUserForm.value);
    // console.log("Registering user with the following data:", this.user);
    // this.accountService.register(this.user).subscribe({
    //   next : response =>{
    //     this.toastr.success('Registration successful'); // Show success message
    //     this.user = response; // Update the user with the response
    //     this.cancel(); // Call cancel to reset the form and emit the event
    //   },
    //   error: error => {
    //     this.toastr.error(error.error); // Show error message
    //   },
    // });
}

  cancel(){
    this.toastr.info('Registration cancelled'); // Show cancellation message
    this.user = { userName: '', token: '' }; // Reset the user
    // this.cancelRegisterMode.emit(false); // Emit the cancel event
  }
}
