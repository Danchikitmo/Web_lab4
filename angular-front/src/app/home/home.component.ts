import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule, HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Page } from "../page.module";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  private apiUrl = 'http://localhost:8080/api/shots/home';
  private apiUrlForPoints = 'http://localhost:8080/api/shots/points';
  private apiUrlForPaginatedPoints = 'http://localhost:8080/api/shots/points/paginated';

  message: string = "";
  data: any[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
    'Content-Type': 'application/json'
  });

  @ViewChild('graph', { static: false }) graph!: ElementRef;

  rValue = 1;
  xValue = 0;
  yValue = NaN;
  skipValue: boolean = false;
  selectedOptionsX: { [key: number]: boolean } = {};
  selectedOptionsR: { [key: number]: boolean } = {};

  ngOnInit() {
    this.selectedOptionsR[1] = true;
    this.selectedOptionsX[0] = true;
    this.loadPaginatedData();
  }

  loadPaginatedData(): void {
    const userId = localStorage.getItem('uid');
    if (!userId) return;

    const params = new HttpParams()
        .set('userId', userId)
        .set('page', this.currentPage.toString())
        .set('size', this.pageSize.toString());

    this.http.get<Page<any>>(this.apiUrlForPaginatedPoints, { params, headers: this.headers }).subscribe(
        (response) => {
          this.data = response.content;
          this.totalPages = response.totalPages;
          this.drawPoints();
        },
        (error) => {
          this.message = "Ошибка при загрузке данных.";
        }
    );
  }

  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.loadPaginatedData();
    }
  }

  onTextChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    const isValidNumber = /^-?\d+(\.\d+)?$/.test(value);

    if (isValidNumber) {
      const numValue = parseFloat(value);
      if (numValue >= -5 && numValue <= 3) {
        this.yValue = numValue;
      } else {
        input.value = "";
      }
    } else {
      if (value !== "-") input.value = "";
    }
  }

  onXChanged(event: Event) {
    this.xValue = parseFloat((event.target as HTMLInputElement).value);
  }

  onRChanged(event: Event) {
    this.rValue = parseFloat((event.target as HTMLInputElement).value);
    this.loadPaginatedData();
    this.drawPoints();
  }

  graphClick(event: { clientX: number; clientY: number }) {
    if (Math.abs(this.rValue) >= 1 && Math.abs(this.rValue) <= 5) {
      const rect = this.graph.nativeElement.getBoundingClientRect();

      const x = ((event.clientX - rect.left) - 300) * (Math.abs(this.rValue) / 200) * Math.sign(this.rValue);
      const y = (300 - (event.clientY - rect.top)) * (Math.abs(this.rValue) / 200) * Math.sign(this.rValue);

      const body = {
        action: "click",
        x: x,
        y: y,
        r: this.rValue,
        uid: localStorage.getItem('uid')
      };

      this.http.post<any>(this.apiUrl, body, { headers: this.headers }).subscribe(
          (response: any) => {
            if (response) {
              this.data.unshift(response); // Добавляем новую точку в начало массива
              this.drawPoints(); // Перерисовываем график
              this.loadPaginatedData(); // Обновляем пагинацию
            } else {
              this.message = "Неверные координаты.";
            }
          },
          () => {
            this.message = "Ошибка при обращении к серверу.";
          }
      );
    }
  }

  exitClick() {
    localStorage.clear();
    this.router.navigate(['/login'], { skipLocationChange: true });
  }

  submitClick() {
    if (!this.checkValues()) {
      this.message = "Проверьте правильность заполнения полей.";
      return;
    }

    const body = { action: "button", x: this.xValue, y: this.yValue, r: this.rValue, uid: localStorage.getItem('uid') };
    this.http.post<any>(this.apiUrl, body, { headers: this.headers }).subscribe(
        response => {
          if (response) {
            this.data.unshift(response);
            this.drawPoints();
          } else {
            this.message = "Неверные координаты.";
          }
        },
        error => { this.message = "Ошибка при обращении к серверу: " + error.message; }
    );
  }

  checkValues() {
    return -5 <= this.xValue && this.xValue <= 3 && -5 <= this.yValue && this.yValue <= 3 && -5 <= this.rValue && this.rValue <= 3;
  }

  drawPoints() {
    const svgElement = this.graph.nativeElement;
    const points = svgElement.querySelectorAll('circle');
    points.forEach((point: Element) => point.remove());


    this.data.forEach(item => {
      const scaleFactor = 200 / Math.abs(this.rValue);
      const xCoord = 300 + item.x * scaleFactor;
      const yCoord = 300 - item.y * scaleFactor;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xCoord.toString());
      circle.setAttribute('cy', yCoord.toString());
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', item.shot ? "rgb(227,122,160)" : "rgba(114,60,89,0.8)");
      svgElement.appendChild(circle); // Добавляем круг
    });
  }

  onCheckBoxChange(event: Event) {
    this.skipValue = (event.target as HTMLInputElement).checked;
  }
}
