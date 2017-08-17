import { NgModule } from '@angular/core';

// import route modules
import { RouterModule, Routes } from '@angular/router';

// import components
// import { LoginComponent} from './components/login/login.component';
// import { LogoutComponent} from './components/logout/logout.component';

const routes: Routes = [
    //{ path: 'login', component: LoginComponent },
    //{ path: 'logout', component: LogoutComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
                enableTracing: true,
            }
        )
    ],
})
export class AppRoutingModule { }
