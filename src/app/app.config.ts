import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';


import {HomeComponent} from "./home.component";
import {WokersComponent} from "./wokers.component";
import {NotFoundComponent} from "./not-found.component";


const appRoutes: Routes =[
    { path: "", component: HomeComponent},
    { path: "wokers", component: WokersComponent},
    { path: "**", component: NotFoundComponent }
];


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes)]
};
