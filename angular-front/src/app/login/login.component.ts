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
      alert("Логин не может быть пустым, или содержать спецсимволы");
    } else if(this.registrationUsername.length > 32){
      alert("Логин должен быть короче 33 символов");
    } else if (!/^[a-zA-Z0-9]+$/.test(this.registrationUsername)) {
      alert("Логин не может содержать спецсимволы");
    } else if (this.registrationPassword.length < 6) {
      alert("Длина пароля должна быть минимум 6 символов");
    } else if (!/[a-zA-Z]/.test(this.registrationPassword) || !/[0-9]/.test(this.registrationPassword)) {
      alert("Пароль должен содержать как минимум одну букву и одну цифру");
    } else if (this.registrationPassword !== this.registrationConfPassword) {
      alert("Пароли не совпадают");
    } else if (/\s/.test(this.registrationUsername) || /\s/.test(this.registrationPassword)) {
      alert("Логин и пароль не должны содержать пробелы");
    } else {
      const body = {
        action: "registration",
        login: this.registrationUsername,
        pswd: this.registrationPassword
      };
      this.http.post<any>(this.apiUrl, body).subscribe(
          (response: { user: { username: string; uid: string; }; token: string; }) => {
          if (response) {
            console.log(response)
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('uid', response.user.uid);
            localStorage.setItem('authToken', response.token);
            this.router.navigate(['/home']);
          } else {
            alert("Пользователь с таким именем уже существует.");
          }
        },
          (error: any) => {
          alert("Ошибка при обращении к серверу.")
          //alert("Error\n" + error.name + "\n\nMessage\n" + error.message);
        }
      );
    }
  }

  login() {
    if (this.loginUsername === "" || this.loginPassword === "") {
      alert("Заполните все поля");
    } else {
      const body = {
        action: "login",
        login: this.loginUsername,
        pswd: this.loginPassword
      };

      this.http.post<any>(this.apiUrl, body).subscribe(
          (response: { user: { username: string; uid: string; }; token: string; }) => {
          if (response) {
            console.log(response)
            localStorage.setItem('username', response.user.username);
            localStorage.setItem('uid', response.user.uid);
            localStorage.setItem('authToken', response.token);
            this.router.navigate(['/home']);
          } else {
            alert("Пользователь не найден.");
          }
        },
          (error: any) => {
          alert("Ошибка при обращении к серверу.")
          //alert("Error\n" + error.name + " " + error.code + "\n\nMessage\n" + error.message);
        }
      );
    }
  }
}
