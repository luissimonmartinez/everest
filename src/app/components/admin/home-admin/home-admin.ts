import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firebase } from '../../../services/firebase';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-home-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './home-admin.html',
  styleUrls: ['./home-admin.scss'],
})
export class HomeAdmin implements OnInit, OnDestroy {
  private dataSubscription?: any;

  formGroup: FormGroup;
  loadingData = signal(false);
  isErrorInServer = signal(false);
  loadingUpdateData = signal(false);
  isMobileView = signal(false);

  constructor(private readonly firebase: Firebase) {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.maxLength(24)]),
      subTitle: new FormControl('', [Validators.maxLength(24)]),
      welcome: new FormControl('', [Validators.maxLength(50)])
    });
  }

  ngOnInit() {
    this.loadData();
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  loadData() {
    this.loadingData.set(true);
    this.isErrorInServer.set(false);
    this.dataSubscription = this.firebase.getDataHome('home').subscribe({
      next: (data) => {
        if (data.length > 0) {
          const { title, subTitle, welcome } = data[0];
          this.formGroup.patchValue({ title, subTitle, welcome });
        }
        this.loadingData.set(false);
      },
      error: () => {
        this.loadingData.set(false);
        this.isErrorInServer.set(true);
      }
    });
  }

  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  changeDataHome() {
    if (this.formGroup.pristine) {
      return;
    }
    if (this.formGroup.valid) {
      this.loadingUpdateData.set(true);
      const { title, subTitle, welcome } = this.formGroup.value;
      this.firebase.setNewDataHome({ title, subTitle, welcome }, 'home').pipe(finalize(() => this.loadingUpdateData.set(false))).subscribe({
        next: () => {
          alert('Datos actualizados correctamente');
          this.formGroup.markAsPristine();
        },
        error: () => {
          alert('Error al actualizar los datos');
        }
      });
    }
  }

  updateMobileView() {
    this.isMobileView.set(window.innerWidth <= 768);
  }
}