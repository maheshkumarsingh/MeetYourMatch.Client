import { Component } from '@angular/core';
import { RegisteruserComponent } from "../registeruser/registeruser.component";
import { Member } from '../_models/member';

@Component({
  selector: 'app-home',
  imports: [RegisteruserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  registerMode: boolean = false;
  tooggleRegisterMode(): void {
    this.registerMode = !this.registerMode;
  }
  cancelRegisterMode(event: boolean): void {
    this.registerMode = event;
  }
}
