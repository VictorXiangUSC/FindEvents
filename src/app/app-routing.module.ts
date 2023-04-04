import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
  // { path: '', component: HomepageComponent},
  { path: 'Search', component: SearchComponent},
  { path: 'Favorites', component: FavoritesComponent},
  { path: '', redirectTo: '/Search', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
