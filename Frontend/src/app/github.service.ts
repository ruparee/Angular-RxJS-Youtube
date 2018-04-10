import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GithubService {
    userUrl = 'https://api.github.com/users';
    accessToken = 'b736bcc3ee86baf865e5c7c05bb50af56dd081d3';

    constructor(private _httpClient: HttpClient) { }

    searchUserByUsername(username): Observable<any> {
        return this._httpClient.get(`${this.userUrl}/${username}?access_token=${this.accessToken}`);
    }

    searchUserRepositories(username): Observable<any> {
        return this._httpClient.get(`${this.userUrl}/${username}/repos?access_token=${this.accessToken}`);
    }
}
