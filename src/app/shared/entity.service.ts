import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Entity } from "../models/entity.model";
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

	  /**
   * Get a single item from the service.
   *
   * @param id ID of the item to get.
   */
	   public read(id: number | string, options?: any): Observable<T> {
		const endpoint = `${this.url}${this.endpoint}/${id}`
		console.log(`read ${endpoint}`)
		return this.http.get<T[]>(endpoint, { ...options, ...httpOptions }).pipe(
		  // tap(console.log),
		  catchError(this.handleError)
		)
	  }

	public list(id?: number | string, options?: any): Observable<T[]>
	{
		let endpoint = `${this.url}${this.endpoint}`;
		if (id) endpoint = endpoint + `/${id}`
		console.log(`list ${endpoint}`);
		return this.http
			.get<T[]>(endpoint, { ...options, ...httpOptions })
			.pipe(catchError(this.handleError));
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