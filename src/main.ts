import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { APP_ROUTES } from './app/app-routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      MatToolbarModule,
      MatDialogModule,
      MatFormFieldModule,
      MatIconModule,
      MatButtonModule,
      MatDialogModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatRadioModule,
      MatSelectModule,
      ReactiveFormsModule,
      HttpClientModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule
    ),
    provideAnimations(),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
  ],
}).catch((err) => console.error(err));
