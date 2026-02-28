import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.scss'],
})
export class HomeAdmin {

  formGroup: FormGroup;

  constructor() {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.maxLength(24)]),
      subTitle: new FormControl('', [Validators.maxLength(24)])
    });
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
}

