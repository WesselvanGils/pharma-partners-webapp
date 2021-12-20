import { NgModule } from "@angular/core"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarUtilsModule } from "./pages/calendar/calendar-header/module"

import { AppRoutingModule } from "./app-routing.module"
import { LoginComponent } from "./core/auth/login/login.component"
import { HomepageComponent } from "./pages/homepage/homepage.component"
import { AboutComponent } from "./pages/about/about.component"
import { SpinnerComponent } from "./shared/spinner/spinner.component"
import { LayoutComponent } from "./core/layout/layout.component"
import { NavbarComponent } from "./core/navbar/navbar.component"
import { FooterComponent } from "./core/footer/footer.component"
import { RootComponent } from "./core/root/root.component"
import { AlertComponent } from "./shared/alert/alert.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { PatientListComponent } from "./pages/patient/patient-list/patient-list.component"
import { PatientDetailComponent } from "./pages/patient/patient-detail/patient-detail.component";
import { PatientComponent } from './pages/patient/patient.component';
import { ContactComponent } from './pages/contact/contact.component'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
	declarations: [
		LoginComponent,
		HomepageComponent,
		AboutComponent,
		SpinnerComponent,
		LayoutComponent,
		NavbarComponent,
		FooterComponent,
		RootComponent,
		AlertComponent,
		CalendarComponent,
		PatientListComponent,
		PatientDetailComponent,
		PatientComponent,
		ContactComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		SweetAlert2Module,
		CalendarUtilsModule,
		BrowserAnimationsModule,
		CalendarModule.forRoot(
			{
				provide: DateAdapter,
				useFactory: adapterFactory
			}
		)
	],
	providers: [],
	bootstrap: [ RootComponent ]
})
export class AppModule { }
