import { Component, OnInit } from "@angular/core"
import { LoggingService } from "src/app/shared/logging.service";

@Component({
	selector: "app-homepage",
	templateUrl: "./homepage.component.html",
	styleUrls: ["./homepage.component.css"]
})
export class HomepageComponent implements OnInit {
	constructor
	(
		private loggingService: LoggingService
	) {}

	ngOnInit(): void 
	{
		this.loggingService.log("The home page was visited")
	}
}
