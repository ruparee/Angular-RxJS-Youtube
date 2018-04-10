import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { switchMap, catchError, tap, pluck, scan, share } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';

import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';

import { GithubService } from './github.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    searchForm: FormGroup;
    searchField: FormControl;
    user: Object;
    repos: Object;
    webSocket: WebSocket;

    constructor(private _githubService: GithubService) { }

    ngOnInit() {
        this.searchField = new FormControl();
        this.searchForm = new FormGroup({
            search: this.searchField
        });

        const userSearch$ = username => this._githubService.searchUserByUsername(username)
            .pipe(
                catchError(error => Observable.of({}) )
            );
        const repoSearch$ = username => this._githubService.searchUserRepositories(username)
            .pipe(
                catchError(error => Observable.of([]) )
            );
        const userAndRepoSearch$ = username => Observable.forkJoin(userSearch$(username), repoSearch$(username));
        const searchField$ = this.searchField.valueChanges.debounceTime(500);

        const ws$ = this.ws()
            .pipe(
                pluck('data'),
                tap(console.log),
                share()
            );

        ws$
            .pipe(
                scan((acc, val) => acc + val, 1)
            )
            .subscribe(val => console.log(`Number of messages: ${val}`));

        const textAndWs$ = Observable.merge(searchField$, ws$);

        textAndWs$
            .pipe(
                switchMap(userAndRepoSearch$)
            )
            .subscribe(res => {
                this.user = res[0];
                this.repos = res[1];
            });
    }

    ngOnDestroy() {
        this.webSocket.close();
    }

    ws(): Observable<any> {
        return Observable.create(subscriber => {
            this.webSocket = new WebSocket('ws://localhost:8999');

            console.log('WS created');

            this.webSocket.addEventListener('message', message => subscriber.next(message));
        });
    }
}
