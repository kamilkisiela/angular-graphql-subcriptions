import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApolloModule } from 'apollo-angular';

import { provideClient } from './apollo';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ApolloModule.withClient(provideClient)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
