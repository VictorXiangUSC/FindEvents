import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule, NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import { GoogleMapsModule } from '@angular/google-maps'


import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


import { AppComponent } from './app.component';
import { GooglemapModalComponent } from './googlemap-modal/googlemap-modal.component';
import { SearchComponent } from './search/search.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { DetailsComponent } from './search/details/details.component';
import { EventsComponent } from './search/events/events.component';
import { FormComponent } from './search/form/form.component';
import { SearchService } from './search/search.service';

@NgModule({
  declarations: [
    AppComponent,
    GooglemapModalComponent,
    SearchComponent,
    FavoritesComponent,
    DetailsComponent,
    EventsComponent,
    FormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCarouselModule,
    MatProgressSpinnerModule,
    GoogleMapsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
