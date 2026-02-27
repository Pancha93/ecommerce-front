import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// SSR imports commented out - uncomment when SSR is properly configured
// import { provideClientHydration } from '@angular/platform-browser';
// import { provideServerRendering } from '@angular/platform-server';

// Icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// Perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// Material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Formly modules
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

// Custom components
import { FileComponent } from './file.component';
import { TimePickerComponent } from './time.component';

// Importa el módulo de ngx-material-timepicker
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideServerRendering(), // Commented out - uncomment when SSR is configured
    provideHttpClient(withInterceptorsFromDi()),
    // provideClientHydration(), // Commented out - uncomment when SSR is configured
    provideAnimationsAsync(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      FeatherModule.pick(allIcons),
      NgScrollbarModule,
      FormlyModule.forRoot({
        types: [
          { name: 'file', component: FileComponent },
          { name: 'timepicker', component: TimePickerComponent }
        ],
        extras: { lazyRender: true },
      }),
      FormlyMaterialModule,
      FormlySelectModule,
      MatDatepickerModule,
      MatNativeDateModule,
      NgxMaterialTimepickerModule,
      BrowserAnimationsModule
    ),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
};
