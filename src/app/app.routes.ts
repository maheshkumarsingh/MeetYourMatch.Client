import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrosComponent } from './errors/test-erros/test-erros.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDeatiledResolver } from './_resolvers/member-deatiled.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'members', component: MemberListComponent, canActivate: [authGuard] },
            { path: 'members/:username', component: MemberDetailComponent, resolve:{member:memberDeatiledResolver} },
            { path: 'member/edit', component: MemberEditComponent , 
                canDeactivate:[preventUnsavedChangesGuard]},
            { path: 'lists', component: ListsComponent },
            { path: 'messages', component: MessagesComponent },
            { path: 'admin', component: AdminPanelComponent , canActivate:[adminGuard]},
        ]
    },
    { path: 'errors', component: TestErrosComponent },
    { path: '**', component: HomeComponent, pathMatch: 'full' } // Wildcard route for a 404 page,
];
