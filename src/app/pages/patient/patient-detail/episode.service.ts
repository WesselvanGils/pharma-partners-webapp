import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Episode } from 'src/app/models/episode.model';

@Injectable({ providedIn: 'root' })
export class EpisodeService extends EntityService<Episode>
{
	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "episodes")
	}
}