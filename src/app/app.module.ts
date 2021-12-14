import { NgModule } from "@angular/core"
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { BrowserModule } from "@angular/platform-browser"
import { HttpClientModule } from "@angular/common/http"

import { AppRoutingModule } from "./app-routing.module"
import { LoginComponent } from "./core/auth/login/login.component"
import { RegisterComponent } from "./core/auth/register/register.component"
import { HomepageComponent } from "./pages/homepage/homepage.component"
import { AboutComponent } from "./pages/about/about.component"
import { SpinnerComponent } from "./shared/spinner/spinner.component"
import { LayoutComponent } from "./core/layout/layout.component"
import { NavbarComponent } from "./core/navbar/navbar.component"
import { FooterComponent } from "./core/footer/footer.component";
import { RootComponent } from './core/root/root.component'
import { AlertComponent } from "./shared/alert/alert.component"

@NgModule({
	declarations: [
		LoginComponent,
		RegisterComponent,
		HomepageComponent,
		AboutComponent,
		SpinnerComponent,
		LayoutComponent,
		NavbarComponent,
		FooterComponent,
  		RootComponent,
		AlertComponent,
		LoginComponent,
		RegisterComponent
	],
	imports: [
		BrowserModule, 
		AppRoutingModule,
		NgbModule,
		HttpClientModule
	],
	providers: [],
	bootstrap: [RootComponent]
})

export class AppModule {}