import { ApplicationConfig, provideZoneChangeDetection,importProvidersFrom } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import {VERSION as MAT_VERSION, MatNativeDateModule} from '@angular/material/core';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';


import {HomeComponent} from "./home/home.component";
import {WokersComponent} from "./wokers/wokers.component";
import {SchemeComponent} from "./scheme/scheme.component";
import {WorkloadComponent} from "./workload/workload.component";

import {NotFoundComponent} from "./not-found.component";

import { provideAnimations } from '@angular/platform-browser/animations';


const appRoutes: Routes =[
    { path: "", component: HomeComponent},
    { path: "wokers", component: WokersComponent},
	{ path: "scheme", component: SchemeComponent},
	{ path: "workload", component: WorkloadComponent},
    { path: "**", component: NotFoundComponent }
];


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(appRoutes),provideAnimations(),  importProvidersFrom(MatNativeDateModule)]
	  
};
