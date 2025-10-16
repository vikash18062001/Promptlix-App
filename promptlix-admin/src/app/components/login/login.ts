import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PromptlixService } from '../../services/promptlix';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-container">
      <form [formGroup]="form" (ngSubmit)="login()" class="login-form">
        <h2>Admin Login</h2>
        <input type="email" formControlName="email" placeholder="Email" />
        <input type="password" formControlName="password" placeholder="Password" />
        <p *ngIf="error" class="error">{{ error }}</p>
        <button type="submit">Sign In</button>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
      height: 100vh;
      background: #000;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
    .login-form {
      border: 1px solid #fff;
      padding: 2rem;
      width: 300px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .login-form input {
      padding: 0.5rem;
      border: 1px solid #fff;
      background: transparent;
      color: #fff;
    }
    .login-form button {
      background: #fff;
      color: #000;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      font-weight: bold;
    }
    .error {
      color: #ff6060;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  error = '';
  form: any;

  constructor(private fb: FormBuilder, private router: Router, private service: PromptlixService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;
    const data = this.form.value;

    this.service.login(data).subscribe({
      next: (res) => {
        this.service.saveToken(res.token);
        localStorage.setItem('admin', res.email);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid email or password';
      }
    });
  }
}
