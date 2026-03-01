import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firebase } from '../../../services/firebase';
import { log } from 'firebase/firestore/pipelines';

@Component({
  selector: 'app-home-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.scss'],
})
export class HomeAdmin implements OnInit {

  formGroup: FormGroup;

  constructor(private readonly firebase: Firebase) {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.maxLength(24)]),
      subTitle: new FormControl('', [Validators.maxLength(24)])
    });
  }

  ngOnInit() {
    console.log('HOLA');
    this.firebase.getDataHome().then(data => {
      console.log('DATA:', data);
      if (data.length > 0) {
        const { title, subTitle } = data[0];
        this.formGroup.patchValue({ title, subTitle });
      } else {
        console.log('No hay datos en data-home');
      }
    }).catch(err => {
      console.error('Error al obtener data-home:', err);
    });
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
}