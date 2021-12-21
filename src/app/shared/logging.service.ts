import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { EntityService } from './entity.service';
import { LogItem } from '../models/logItem.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggingService extends EntityService<LogItem>
{
    logs: LogItem = new LogItem("1")
    protected entityService: EntityService<LogItem>

	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "logs")
		this.logs.messages = []
    }

    public log( message: string )
    {
        console.log(`${message} has been added to the logs`)
        this.logs.messages.push(message)
    }

    public sendLogs ()
    {
        this.entityService.create(this.logs)
    }
}