import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-test-erros',
  imports: [NgFor, NgIf],
  templateUrl: './test-erros.component.html',
  styleUrl: './test-erros.component.css',
})
export class TestErrosComponent {
  baseUrl = 'https://localhost:5001/api/v1/';
  validationErrors: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  get404Error() {
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get400Error() {
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get500Error() {
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get401Error() {
    this.http.get(this.baseUrl + 'buggy/auth').subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get400ValidationError() {
    console.log('get400ValidationError');
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: (response) => {
        console.log('response', response);
      },
      error: (error) => {
        console.log('Full error:', error);

        // Handle ModelState errors (ASP.NET Core 400 format)
        if (error.error?.errors) {
          this.validationErrors = [];
          for (let field in error.error.errors) {
            this.validationErrors.push(...error.error.errors[field]);
          }
        } else {
          this.validationErrors = ['An unknown error occurred.'];
        }

        console.log(this.validationErrors);
      },
    });
  }
}
