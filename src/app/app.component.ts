import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hello-ng';
  formData = {
    name: '',
    img: '',
  };
  submit() {
    console.log(this.formData);
  }
}
