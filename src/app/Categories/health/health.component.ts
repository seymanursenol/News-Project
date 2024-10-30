import { Component, EventEmitter, Output } from '@angular/core';
import { News, NewsName } from '../../Models/NewsModel';
import { NewsService } from '../../Services/news.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './health.component.html',
  styleUrl: './health.component.css'
})
export class HealthComponent {
  @Output() filterApplied= new EventEmitter<string[]>();

  currentPage: number =1;
  pageSize: number=20;
  totalResult: number=0;
  searchTerm: string="";
  category: string | null = null;

  news: News | null = null;
  newsSources: NewsName[]=[];

  constructor( private newsService: NewsService){}

  ngOnInit(): void
  {
    this.loadToBusiness();
  }

  loadToBusiness(){
    this.newsService.selectedId$.subscribe(id=>{
      this.category=id;
    })
    if(this.category!=null)
    {
      this.newsService.getTopHeadlines(this.category,
        this.searchTerm,
        this.currentPage,this.pageSize).subscribe(
        (data: News)=> {
          this.news = data;
          this.totalResult = data.totalResults;
          this.news.articles= this.news.articles.filter(article=> article.source.name!=="[Removed]");
          const uniqueNewsSources = new Set(this.news.articles.map(article => article.source.name));
          this.newsSources = Array.from(uniqueNewsSources).map(name => ({ name }));
          this.newsSources= this.news.articles.map(article=>({name:article.source.name}));
          this.totalResult = this.news.articles.length;
        },error=>{
          console.error("Hata", error);
        }
      );
    }

  }

  changePage(page: number): void{
    this.currentPage = page;
    this.loadToBusiness();
  }
  get totalPages(): number {
    return Math.ceil(this.totalResult / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilter(){
    const selectedSources= this.newsSources.filter(source=>source.selected).map(source=>source.name);
    this.filterApplied.emit(selectedSources);

    if(this.news){
      if(selectedSources.length>0){
        this.news.articles=this.news.articles.filter(articles=>selectedSources.includes(articles.source.name))
      }else{
        this.news.articles= this.news.articles;
      }
    }
  }
}
