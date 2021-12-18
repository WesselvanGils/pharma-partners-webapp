import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Receipt } from 'src/app/models/receipt.model';

@Injectable({ providedIn: 'root' })
export class ReceiptService extends EntityService<Receipt>
{
	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "receipts")
    }
}