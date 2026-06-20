import { AppComponent } from './app/app'; // Asegúrate de que diga AppComponent
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));