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


/**
 * // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJrYh-aMoSeEH9H9wsdiJWiNPGtPNrhkE",
  authDomain: "portafolio-75332.firebaseapp.com",
  projectId: "portafolio-75332",
  storageBucket: "portafolio-75332.firebasestorage.app",
  messagingSenderId: "777612773520",
  appId: "1:777612773520:web:c2eb810a3aed0c76b7f015",
  measurementId: "G-YLD9PD2N0X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 */