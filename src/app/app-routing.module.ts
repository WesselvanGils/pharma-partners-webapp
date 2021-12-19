import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { LoggedInAuthGuard } from "./core/auth/auth.guard"
import { LoginComponent } from "./core/auth/login/login.component"
import { LayoutComponent } from "./core/layout/layout.component"
import { AboutComponent } from "./pages/about/about.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { ContactComponent } from "./pages/contact/contact.component"
import { HomepageComponent } from "./pages/homepage/homepage.component"
import { PatientDetailComponent } from "./pages/patient/patient-detail/patient-detail.component"
import { PatientListComponent } from "./pages/patient/patient-list/patient-list.component"
import { PatientComponent } from "./pages/patient/patient.component"
import { MedicationComponent } from './pages/medication/medication.component';
import { MedicationAddComponent } from "./pages/medication/medication-add/medication-add.component"
import { ReceiptsComponent } from "./pages/receipts/receipts.component"
import { EpisodeComponent } from "./pages/episode/episode.component"

const routes: Routes = [
	{
		path: "",
		component: LayoutComponent,
		canActivate: [LoggedInAuthGuard],
		children: 
		[
			{ path: "", pathMatch: "full", redirectTo: "home" },
			{ path: "home", component: HomepageComponent },
			{ path: "about", component: AboutComponent },
			{ path: "contact", component: ContactComponent },
			{ path: "calendar", component: CalendarComponent },
			{ path: "recept", component: ReceiptsComponent },
			{ path: "episode", component: EpisodeComponent },
			{ path: "medicijn", component: MedicationComponent},
			{ path: "medicijn/toevoegen", component: MedicationAddComponent},
			{ path: "patient", component: PatientComponent,
				children: 
				[
					{ path: "list", component: PatientListComponent },
				]
			},
			{ path: "patient/detail/:_id", component: PatientDetailComponent }
		]
	},
	{ path: "login", component: LoginComponent },
	{ path: "**", redirectTo: "/" }
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
