import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Firebase } from '../../services/firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private dataSubscription?: any;
  title = signal('');
  subTitle = signal('');
  welcome = signal('');

  constructor(private readonly firebase: Firebase) { }

  ngOnInit() {
    this.loadata();
  }

  loadata() {
    this.dataSubscription = this.firebase.getDataHome('home').subscribe({
      next: (response) => {
        this.title.set(response[0]?.title || '');
        this.subTitle.set(response[0]?.subTitle || '');
        this.welcome.set(response[0]?.welcome || '');
      },
      error: () => {
        console.error('Error al cargar datos de Home');
      }
    });
  }


  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}