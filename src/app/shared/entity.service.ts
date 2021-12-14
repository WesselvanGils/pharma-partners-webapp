import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Entity } from "../models/entity";
import { Alert } from "./alert/alert.service";

const httpOptions = {
	observe: 'body',
	responseType: 'json',
};

export class EntityService<T extends Entity> 
{
	constructor(
		protected readonly http: HttpClient,
		public readonly url: string,
		public readonly endpoint: string
	) { }

    public create(item: T, options?: any): Observable<T>
	{
		const endpoint = `${this.url}${this.endpoint}`;
		console.log(`create ${endpoint}`);
		return this.http
			.post<T>(endpoint, item, { ...options, ...httpOptions })
			.pipe(
				// tap(console.log),
				// map((response: any) => response.result),
				catchError(this.handleError)
			);
	}

    public handleError(error: HttpErrorResponse): Observable<any>
	{
		console.log(error);

		const errorResponse: Alert = {
			type: 'error',
			message: error.error.message || error.message,
		};
		// return an error observable with a user-facing error message
		return throwError(errorResponse);
	}
}