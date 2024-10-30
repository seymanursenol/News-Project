import { Component, OnInit } from '@angular/core';
import { NewsService } from '../Services/news.service';
import { Article, News, TrendNews } from '../Models/NewsModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  news: News | null = null;
  currentPage: number = 1;
  pageSize: number = 20;
  totalResults: number = 0;
  trend: TrendNews[]=[]
  trend2: TrendNews[]=[]
  searchTerm: string="";
  filteredNewsList: Article[]=[];
  selectedId: string | null = null;
  category:string="";


  constructor(private newsService: NewsService) {}

  ngOnInit(): void {

    this.newsService.selectedId$.subscribe(id => {
      this.selectedId = id;

    });
    this.loadTopHeadlines();
    this.newsService.filterListNews$.subscribe((newsList:Article[])=>{
      this.filteredNewsList=newsList;
    })
  }

  loadTopHeadlines(): void {
    this.newsService.getTopHeadlines(this.category,this.searchTerm,this.currentPage, this.pageSize).subscribe(
      (data: News) => {
        this.news = data;
        this.totalResults = data.totalResults;
        if(this.news!=null){
          this.news.articles= this.news.articles.filter(artice=> artice.title!=="[Removed]")
          this.news.articles.sort((a, b) => {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
          });
          const trendingNews = this.news.articles.slice(6, 10);
          this.trend= trendingNews;
          const trendingNews2 = this.news.articles.slice(0,4);
          this.trend2= trendingNews2;
        }
      },
      error => {
        console.error('Hata:', error);
      }
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadTopHeadlines();
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
