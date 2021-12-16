import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Meeting } from 'src/app/models/meeting.model';

@Component({
	selector: 'app-meeting',
	templateUrl: './meeting.component.html',
	styleUrls: [ './meeting.component.css' ]
})
export class MeetingComponent implements OnInit, OnChanges
{
	@Input() meeting$: Observable<any>
	constructor() { }

	ngOnInit(): void {}

	ngOnChanges (): void 
	{
		if (this.meeting$)
		{
			this.meeting$.subscribe( ( result ) => console.log(result))
		}
	}
}
