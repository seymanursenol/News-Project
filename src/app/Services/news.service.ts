import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../Environment/environment.prod';
import { Article, News } from '../Models/NewsModel';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private filterNewsListSource= new BehaviorSubject<Article[]>([]);
  filterListNews$= this.filterNewsListSource.asObservable();

  private linkId = new BehaviorSubject<string|null>(null);
  selectedId$: Observable<string | null> = this.linkId.asObservable();

  private apiKey = environment.apiKey;
  private baseUrl = environment.apiURL;
  private link:string | null = null;

  constructor(private http: HttpClient) { }

  getTopHeadlines(link:string,searchTerm: string, page: number = 1, pageSize: number = 20): Observable<News> {
    const params = {
      country: 'us',
      category: link,
      q: searchTerm,
      apiKey: this.apiKey,
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    return this.http.get<News>(this.baseUrl, { params });
  }

  setFilteredNewsList(newsList: Article[]){
    this.filterNewsListSource.next(newsList);
  }

  updateLinkId(id: string) {
    this.linkId.next(id); // BehaviorSubject'i güncelle
    return this.selectedId$.subscribe(id=>{
      this.link=id;
      console.log("service: "+ this.link);
    })
  }
}
