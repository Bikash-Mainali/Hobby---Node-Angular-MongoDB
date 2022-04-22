import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { SongsComponent } from './components/songs/songs.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { SongComponent } from './components/song/song.component'
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './components/add/add.component';
import { ArtistComponent } from './components/add-artist/artist.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditComponent } from './components/edit/edit.component';
import { EditArtistComponent } from './components/edit-artist/edit-artist.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { ProfileComponent } from './components/profile/profile.component';


@NgModule({
  declarations: [
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    NavigationComponent,
    AppComponent,
    SongsComponent,
    ErrorPageComponent,
    SongComponent,
    SongsComponent,
    AddComponent,
    ArtistComponent,
    EditComponent,
    EditArtistComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(
      {
      timeOut: 1000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      }
    ),
    NgSelectModule,
  ],

  providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS } ,JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
