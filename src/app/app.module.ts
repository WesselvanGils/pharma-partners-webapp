import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { AboutComponent } from './pages/about/about.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@NgModule({
	declarations: [
	
      LoginComponent,
      RegisterComponent,
      HomepageComponent,
      AboutComponent,
      SpinnerComponent
  ],
	imports: [
		BrowserModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: []
})
export class AppModule { }
