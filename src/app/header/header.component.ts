import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';  // Angular Router'ı kullanıyoruz
import { NewsService } from '../Services/news.service';
import { Article, News } from '../Models/NewsModel';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css' ]
})
export class HeaderComponent {

  constructor(private router: Router, private newsService: NewsService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}


  currentPage: number = 1;
  pageSize: number = 20;
  searchTerm: string="";
  newsList: Article[]=[];
  filteredNewsList: Article[] = [];  // Filtrelenmiş haber listesi
  category:string="";


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const lastClickedId = localStorage.getItem('lastClickedId');
      if (lastClickedId) {
        this.newsService.updateLinkId(lastClickedId);
        console.log("Son tıklanan ID:", lastClickedId);
      }
    }
  }
  searchNews(): void {
    if (this.searchTerm) {
      this.newsService.getTopHeadlines(this.category,this.searchTerm,this.currentPage, this.pageSize)
        .subscribe((data: News) => {
          this.newsList = data.articles;

          this.filteredNewsList = this.newsList.filter(article =>
            article.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          this.newsService.setFilteredNewsList(this.filteredNewsList);
        });
    }
  }

  logId(event: any): void {
    const elementId = event.target.id;
    console.log("Tıklanan ID:", elementId);

    // localStorage'a sadece tarayıcıda erişim sağlar
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('lastClickedId', elementId);

      // ID'yi BehaviorSubject üzerinden güncelle
      this.newsService.updateLinkId(elementId);

    }
  }

}
