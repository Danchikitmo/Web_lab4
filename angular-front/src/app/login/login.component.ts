import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  private apiUrl = 'http://localhost:8080/api/users/login';
  loginClick = true;
  registrationClick = false;
  loginUsername: string = "";
  loginPassword: string = "";
  registrationUsername: string = "";
  registrationPassword: string = "";
  registrationConfPassword: string = "";
  message: string = "";

  onLoginClick() {
    this.loginClick = true;
    this.registrationClick = false;
  }

  onRegistrationClick() {
    this.registrationClick = true;
    this.loginClick = false;
  }

  register() {
    if (this.registrationUsername === "") {
      this.message = "Логин не может быть пустым, или содержать спецсимволы";
    } else if (this.registrationUsername.length > 32) {
      this.message = "Логин должен быть короче 33 символов";
    } else if (!/^[a-zA-Z0-9]+$/.test(this.registrationUsername)) {
      this.message = "Логин не может содержать спецсимволы";
    } else if (this.registrationPassword.length < 6) {
      this.message = "Длина пароля должна быть минимум 6 символов";
    } else if (!/[a-zA-Z]/.test(this.registrationPassword) || !/[0-9]/.test(this.registrationPassword)) {
      this.message = "Пароль должен содержать как минимум одну букву и одну цифру";
    } else if (this.registrationPassword !== this.registrationConfPassword) {
      this.message = "Пароли не совпадают";
    } else if (/\s/.test(this.registrationUsername) || /\s/.test(this.registrationPassword)) {
      this.message = "Логин и пароль не должны содержать пробелы";
    } else {
      const body = {
        action: "registration",
        login: this.registrationUsername,
        pswd: this.registrationPassword
      };
      this.http.post<any>(this.apiUrl, body).subscribe(
          (response: { user: { username: string; uid: string; }; token: string; }) => {
            if (response) {
              localStorage.setItem('username', response.user.username);
              localStorage.setItem('uid', response.user.uid);
              localStorage.setItem('authToken', response.token);
              this.router.navigate(['/home']);
            } else {
              this.message = "Пользователь с таким именем уже существует.";
            }
          },
          () => {
            this.message = "Ошибка при обращении к серверу.";
          }
      );
    }
  }

  login() {
    if (this.loginUsername === "" || this.loginPassword === "") {
      this.message = "Заполните все поля";
    } else {
      const body = {
        action: "login",
        login: this.loginUsername,
        pswd: this.loginPassword
      };

      this.http.post<any>(this.apiUrl, body).subscribe(
          (response: { user: { username: string; uid: string; }; token: string; }) => {
            if (response) {
              localStorage.setItem('username', response.user.username);
              localStorage.setItem('uid', response.user.uid);
              localStorage.setItem('authToken', response.token);
              this.router.navigate(['/home']);
            } else {
              this.message = "Пользователь не найден.";
            }
          },
          () => {
            this.message = "Ошибка при обращении к серверу.";
          }
      );
    }
  }
}