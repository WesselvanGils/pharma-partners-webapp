import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

export interface Alert {
	type: string
	message: string
}

@Injectable({
	providedIn: "root"
})
export class AlertService {
	public alert$ = new Subject<Alert>()

	success(msg: string): void {
		this.alert$.next({ type: "success", message: msg })
	}

	error(msg: string): void {
		this.alert$.next({ type: "error", message: msg })
	}
}
