import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { AppRoutingModule } from './app.routes';
// services

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        // form: reactive form vs formsModule
        ReactiveFormsModule, 
        HttpModule
    ],
    declarations: [
        AppComponent,
        FileUploaderComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        // HashLocationStrategy: there should be a # tag in the url
        // {provide: LocationStrategy, useClass: HashLocationStrategy}
        { provide: LocationStrategy, useClass: PathLocationStrategy }
    ]
})
export class AppModule {

};
