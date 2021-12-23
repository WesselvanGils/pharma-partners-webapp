import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Episode } from 'src/app/models/episode.model';
import { BehaviorSubject } from 'rxjs';
import { Journal } from 'src/app/models/journal.model';

@Injectable({ providedIn: 'root' })
export class EpisodeService extends EntityService<Episode>
{
	private journalSource = new BehaviorSubject<Journal[]>(undefined)
	currentJournal = this.journalSource.asObservable()

	private episodeSource = new BehaviorSubject<Episode>(undefined)
	currentEpisode = this.episodeSource.asObservable()

	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "episodes")
	}

	changeJournal( journals: Journal[], episode: Episode )
	{
		this.journalSource.next(journals)
		this.episodeSource.next(episode)
	}
}