import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  private apiUrl = 'http://localhost:8080/api/shots/home';
  private apiUrlForPoints = 'http://localhost:8080/api/shots/points';

  ngOnInit() {
    this.selectedOptionsR[1] = true;
    this.selectedOptionsX[0] = true;
    this.onLoadTableUpdate();
    console.log(localStorage.getItem('username'));
  }
  @ViewChild('graph', { static: false }) graph!: ElementRef;
  @ViewChild('resultTable', { static: false }) resultTable!: ElementRef;
  @ViewChild('form', { static: false }) form!: ElementRef;
  @ViewChild('loseVideoPlayer', { static: false }) loseVideoPlayer!: ElementRef;
  @ViewChild('winVideoPlayer', { static: false }) winVideoPlayer!: ElementRef;
  rValue = 1;
  xValue = parseFloat("0");
  yValue = parseFloat("");
  skipValue: boolean = false;
  selectedOptionsX: { [key: number]: boolean } = {};
  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
    'Content-Type': 'application/json'
  });
  data: any[] = [];

  selectedOptionsR: { [key: number]: boolean } = {};

  onXChanged(event: Event){
    this.xValue = parseFloat((event.target as HTMLInputElement).value);
  }

  onRChanged(event: Event){
    this.rValue = parseFloat((event.target as HTMLInputElement).value);
    this.drawPoints();
  }
  graphClick(event: { clientX: any; clientY: any; }){

    if (1 <= this.rValue && this.rValue <= 5) {
      const rect = this.graph.nativeElement.getBoundingClientRect();
      const body = {
        action: "click",
        x: ((event.clientX - rect.left) - 300) * (this.rValue / 200),
        y: (300 - (event.clientY - rect.top)) * (this.rValue / 200),
        r: this.rValue,
        uid: localStorage.getItem('uid')
      };
      this.http.post<any>(this.apiUrl, body, {headers: this.headers}).subscribe(
        (response: any) => {
          if (response) {
            this.playVideo(response.shot);
            this.data.push(response);
            this.drawPoints();
          }
          else {
            alert("Неверные координаты.");
          }
        },
        (error: { name: string; message: string; }) => {
          alert("Ошибка при обращении к серверу.")
          //alert("Error\n" + error.name + "\n\nMessage\n" + error.message);
        }
      );
    }
  }

  exitClick() {
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    localStorage.removeItem('uid');
    this.router.navigate(['/login'], { skipLocationChange: true });
  }

  submitClick(){
    if (this.checkValues()) {
      const body = {
        action: "button",
        x: this.xValue,
        y: this.yValue,
        r: this.rValue,
        uid: localStorage.getItem('uid')
      };
      this.http.post<any>(this.apiUrl, body, {headers: this.headers}).subscribe(
          (response: { shot: number; }) => {
            if (response) {
              this.playVideo(response.shot);
              this.data.push(response);
              this.drawPoints();
            }
            else {
              alert("Неверные координаты.");
            }
        },
          (error: { name: string; message: string; }) => {
            alert("Ошибка при обращении к серверу.")
          //alert("Error\n" + error.name + "\n\nMessage\n" + error.message);
        }
      );
    }
    else
      alert("Проверьте правильность заполнения полей.");
  }

  checkValues(){
    console.log(-3 <= this.xValue && this.xValue <= 5)
    console.log(-5 <= this.yValue && this.yValue <= 3)
    console.log(1 <= this.rValue && this.rValue <= 5)
    if (-3 <= this.xValue && this.xValue <= 5 && -5 <= this.yValue && this.yValue <= 3 && 1 <= this.rValue && this.rValue <= 5)
      return true;
    return false;
  }

  onTextChanged(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const isValidNumber = /^[-]?(\d+(\.\d*)?|\.\d+)$/.test(inputValue);
    this.yValue = parseFloat((event.target as HTMLInputElement).value);
    if (!isValidNumber) {
      if ((event.target as HTMLInputElement).value !== "-")
        (event.target as HTMLInputElement).value = "";
    } else {
      const yValue = parseFloat(inputValue);
      if (yValue < -5 || yValue > 3) {
        (event.target as HTMLInputElement).value = "";
      }
    }
  }
  playVideo(shot: number) {
    if (!this.skipValue) {
      let videoElement;
      if (shot == 0)
        videoElement = this.loseVideoPlayer.nativeElement;
      else if (shot == 1)
        videoElement = this.winVideoPlayer.nativeElement;
      videoElement.style.display = 'block';
      this.graph.nativeElement.style.display = 'none';
      this.resultTable.nativeElement.style.display = 'none';
      this.form.nativeElement.style.display = 'none';
      videoElement.play();
    }
  }
  onVideoEnded() {
    this.loseVideoPlayer.nativeElement.style.display = 'none';
    this.winVideoPlayer.nativeElement.style.display = 'none';
    this.graph.nativeElement.style.display = 'block';
    this.resultTable.nativeElement.style.display = 'block';
    this.form.nativeElement.style.display = 'block';
  }
  onLoadTableUpdate(){
    const body = {
      action: "getAllForUser",
      uid: localStorage.getItem('uid')
    };
    this.http.post<any>(this.apiUrlForPoints, body, {headers: this.headers}).subscribe(
      (response: any[]) => {
        if (response) {
          console.log(response)
          this.data = response;
          this.drawPoints();
        }
        else {
          alert("Неверные координаты.");
        }
      },
      (error: { name: string; message: string; }) => {
        alert("Ошибка при обращении к серверу.")
        //alert("Error\n" + error.name + "\n\nMessage\n" + error.message);
      }
    );
  }

  updateTable(){
    this.drawPoints();
  }

  drawPoints(){
    const circles = this.graph.nativeElement.querySelectorAll('circle');
    circles.forEach((circle: any) => {
      this.graph.nativeElement.removeChild(circle);
    });
    let color;
    let opacity;
    let strokeOpacity;
    this.data.forEach(item => {
      if (item.shot == 1 && this.rValue == item.r) {
        color = "rgb(227,122,160)";
        opacity = "1";
        strokeOpacity = "0.3";
      }
      else if (item.shot == 0 && this.rValue == item.r) {
        color = "rgba(114,60,89,0.8)"
        opacity = "1";
        strokeOpacity = "0.1";
      }
      else {
        color = "gray"
        opacity = "0.4";
        strokeOpacity = "0";
      }
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', (300 + item.x * (200 / this.rValue)).toString());
      circle.setAttribute('cy', (300 - item.y * (200 / this.rValue)).toString());
      circle.setAttribute('r', '5');
      circle.setAttribute('visibility', 'visible');
      circle.setAttribute('stroke', 'white');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke-opacity', strokeOpacity);
      circle.setAttribute('fill-opacity', opacity);
      this.graph.nativeElement.appendChild(circle);
    });
  }

  onCheckBoxChange(event: Event) {
    this.skipValue = (event.target as HTMLInputElement).checked
    console.log(this.skipValue)
  }

}
