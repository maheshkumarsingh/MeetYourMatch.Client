import { Component, inject, input, OnInit, output, } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from '../_forms/date-picker/date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registeruser',
  imports: [ReactiveFormsModule,TextInputComponent, DatePickerComponent],
  templateUrl: './registeruser.component.html',
  styleUrl: './registeruser.component.css'
})
export class RegisteruserComponent implements OnInit {
  // usersFromHomeComponent = input.required<User[]>();
  // cancelRegisterMode= output<boolean>();
  registerUserForm: FormGroup = new FormGroup({});
  private fb = inject(FormBuilder);
  accountService = inject(AccountService);
  toastr = inject(ToastrService);
  maxDate = new Date();
  private router = inject(Router);
  validationErrors: string[] = [];

  ngOnInit(): void {
    // console.log("RegisteruserComponent initialized", this.usersFromHomeComponent);
    this.initializeRegisterForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }
  initializeRegisterForm() {
    // this.registerUserForm = new FormGroup({
    //   username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    //   password: new FormControl('',[Validators.required,Validators.minLength(4), Validators.maxLength(12)]),
    //   confirmPassword: new FormControl('',[Validators.required, this.matchPasswordValues('password')]),
    // })
    this.registerUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(12)]],
      confirmPassword: ['', [Validators.required, this.matchPasswordValues('password')]],
      gender: ['male', [Validators.required]],
      knownAs: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
    })
    this.registerUserForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerUserForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }
  matchPasswordValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isMatching: true };
    }
  }
  register() {
    const dob = this.getDateOnly(this.registerUserForm.get('dateOfBirth')?.value);
    this.registerUserForm.patchValue({dateOfBirth:dob});
    console.log(this.registerUserForm.value);
    this.accountService.register(this.registerUserForm.value).subscribe({
      next: response => {
        this.toastr.success('Registration successful');
        this.router.navigateByUrl('/members');
        this.cancel();
      },
      error: error => {
        this.toastr.error('Registration unsuccessful');
        this.validationErrors = error;
      },
    });
  }
  private getDateOnly(dob:string|undefined){
    if(!dob) return;
    return new Date(dob).toISOString().slice(0,10);
  }
  cancel() {
    this.toastr.info('Registration cancelled');
    this.registerUserForm.reset;
    // this.cancelRegisterMode.emit(false); // Emit the cancel event
  }
}
