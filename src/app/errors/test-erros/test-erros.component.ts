import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-erros',
  imports: [NgFor, NgIf],
  templateUrl: './test-erros.component.html',
  styleUrl: './test-erros.component.css',
})
export class TestErrosComponent {
  baseUrl = environment.apiUrl;
  validationErrors: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

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

        // 🔍 Directly check if error is an array
        if (Array.isArray(error)) {
          this.validationErrors = error;
        }
        // ✅ Case: check error.error (still good to keep for future compatibility)
        else if (Array.isArray(error.error)) {
          this.validationErrors = error.error;
        }
        // ✅ ModelState-style object
        else if (error.error?.errors) {
          this.validationErrors = [];
          for (let field in error.error.errors) {
            this.validationErrors.push(...error.error.errors[field]);
          }
        }
        // ✅ Plain string message fallback
        else if (typeof error.error === 'string') {
          this.validationErrors = [error.error];
        }
        // ❌ Fallback
        else {
          this.validationErrors = ['An unknown error occurred.'];
        }

        console.log('Parsed validation errors:', this.validationErrors);
      },
    });
  }
}
