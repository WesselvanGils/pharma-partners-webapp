import { NgModule } from "@angular/core"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { BrowserModule } from "@angular/platform-browser"
import { HttpClientModule } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { FullCalendarModule } from "@fullcalendar/angular"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"

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
import { MeetingComponent } from "./pages/calendar/meeting/meeting.component"
import { PatientListComponent } from "./pages/patient/patient-list/patient-list.component"
import { PatientDetailComponent } from "./pages/patient/patient-detail/patient-detail.component";
import { PatientComponent } from './pages/patient/patient.component';
import { ContactComponent } from './pages/contact/contact.component'
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTablesModule } from "angular-datatables"

FullCalendarModule.registerPlugins([
	interactionPlugin,
	dayGridPlugin
])

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
		MeetingComponent,
		PatientListComponent,
		PatientDetailComponent,
		PatientComponent,
  ContactComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		FullCalendarModule,
		SweetAlert2Module,
		DataTablesModule
	],
	providers: [],
	bootstrap: [ RootComponent ]
})
export class AppModule { }
