import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { Episode } from 'src/app/models/episode.model';
import { Alert, AlertService } from 'src/app/shared/alert/alert.service';
import { EpisodeService } from './episode.service';

@Component({
	selector: 'app-episode',
	templateUrl: './episode.component.html',
	styleUrls: [ './episode.component.css' ]
})
export class EpisodeComponent implements OnInit
{

	episodeForm: FormGroup
	subscription!: Subscription


	tempEpisode!: Episode
	newEpisode: Episode = {
		_id: undefined,
		description: '',
		priority: false,
		publicationDate: new Date('25-12-2021'),
		startDate: new Date('25-12-2021'),
		ICPC: 'B81'
	}

	ICPC: String[] = [ 'B81', 'C80', 'A55', 'C11', 'F22' ]

	constructor(private route: ActivatedRoute, private alertService: AlertService, private router: Router, private episodeService: EpisodeService) { }

	ngOnInit()
	{
		this.subscription = this.route.paramMap.pipe(
			switchMap((params: ParamMap) =>
			{
				if (!params.get('_id'))
				{
					return of(this.newEpisode)
				} else
				{
					return this.episodeService.read(params.get('_id')!)
				}
			})
		).subscribe((episode) =>
		{
			this.tempEpisode = episode
			this.episodeForm = new FormGroup({
				_id: new FormControl(episode._id),
				ICPC: new FormControl(episode.ICPC, [ Validators.required ]),
				description: new FormControl(episode.description, [ Validators.required ]),
				publicationDate: new FormControl(episode.publicationDate, [ Validators.required ]),
				startDate: new FormControl(episode.startDate, [ Validators.required ]),
				priority: new FormControl(episode.priority, [ Validators.required ]),
			});
		})

	}

	onSubmit(): void
	{
		if (this.episodeForm.valid)
		{
			if (this.tempEpisode._id)
			{
				this.episodeService.update(this.episodeForm.value)
					.pipe(catchError((error: Alert) =>
					{
						console.log(error)
						this.alertService.error(error.message)
						return of(false)
					}))
					.subscribe((success) =>
					{
						console.log(success)
						if (success)
						{
							this.router.navigate([ '../patient/detail/' + this.tempEpisode._id ])
						}
					})
			} else
			{
				this.episodeService.create(this.episodeForm.value)
					.pipe(catchError((error: Alert) =>
					{
						console.log(error)
						this.alertService.error(error.message)
						return of(false)
					}))
					.subscribe((success) =>
					{
						console.log(success)
						if (success)
						{
							this.router.navigate([ '/home' ])
						}
					})
			}
		}
	}

	ngOnDestroy()
	{
		this.subscription?.unsubscribe()
	}

}
