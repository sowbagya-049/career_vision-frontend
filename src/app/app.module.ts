import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import your components
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InsightsComponent } from './insights/insights.component';
import { TimelineComponent } from './timeline/timeline.component';

// Import AuthInterceptor - create this if it doesn't exist
import { AuthInterceptor } from './auth/auth-interceptor';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';

// imports
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    InsightsComponent,
    TimelineComponent,
    ResumeUploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
