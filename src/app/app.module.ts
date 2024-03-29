import { NgModule } from "@angular/core"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { HttpClientModule } from "@angular/common/http"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarUtilsModule } from "./pages/calendar/calendar-header/module"
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DataTablesModule } from "angular-datatables";
import { MatRadioModule } from '@angular/material/radio';

import { AppRoutingModule } from "./app-routing.module"
import { LoginComponent } from "./core/auth/login/login.component"
import { HomepageComponent } from "./pages/homepage/homepage.component"
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
import { AppointmentComponent } from './pages/calendar/appointment/appointment.component';
import { PatientJournalComponent } from './pages/patient/patient-detail/patient-journal/patient-journal.component';
import { PatientEpisodeComponent } from './pages/patient/patient-detail/patient-episode/patient-episode.component';
import { PatientDiagnosticComponent } from './pages/patient/patient-detail/patient-diagnostic/patient-diagnostic.component';
import { PatientPrescriptionComponent } from './pages/patient/patient-detail/patient-prescription/patient-prescription.component';

import { registerLocaleData } from "@angular/common"
import localeNl from "@angular/common/locales/nl-BE"
import { extend } from "jquery"

registerLocaleData(localeNl)

@NgModule({
	declarations: [
		LoginComponent,
		HomepageComponent,
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
		ContactComponent,
		AppointmentComponent,
		PatientJournalComponent,
		PatientEpisodeComponent,
		PatientDiagnosticComponent,
		PatientPrescriptionComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		SweetAlert2Module,
		DataTablesModule,
		MatRadioModule,
		SweetAlert2Module,
		CalendarUtilsModule,
		BrowserAnimationsModule,
		CalendarModule.forRoot(
			{
				provide: DateAdapter,
				useFactory: adapterFactory
			},
			{
				dateFormatter:
				{
					provide: CalendarDateFormatter,
					useClass: AppModule
				}
			}
		)
	],
	providers: [],
	bootstrap: [ RootComponent ]
})
export class AppModule extends CalendarNativeDateFormatter
{
	public override weekViewHour({ date, locale }: DateFormatterParams): string 
	{
		return new Intl.DateTimeFormat('nl', 
		{
			hour: 'numeric',
			minute: 'numeric',
		}).format(date);
	}
}