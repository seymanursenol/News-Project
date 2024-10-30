import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { EntertainmentComponent } from './Categories/entertainment/entertainment.component';
import { GeneralComponent } from './Categories/general/general.component';
import { HealthComponent } from './Categories/health/health.component';
import { ScienceComponent } from './Categories/science/science.component';
import { SportsComponent } from './Categories/sports/sports.component';
import { TechnologyComponent } from './Categories/technology/technology.component';
import { BusinessComponent } from './Categories/business/business.component';

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "about", component: AboutComponent},
  {path: "business", component: BusinessComponent},
  {path: "entertainment", component: EntertainmentComponent},
  {path: "general", component: GeneralComponent},
  {path: "health", component: HealthComponent},
  {path: "science", component: ScienceComponent},
  {path: "sports", component: SportsComponent},
  {path: "technology", component: TechnologyComponent},
];
