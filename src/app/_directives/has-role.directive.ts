import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Directive({
  selector: '[appHasRole]', //*appHasRole
  standalone:true
})
export class HasRoleDirective implements OnInit{
  @Input() appHasRole:string[] =[];
  private accountService = inject(AccountService);
  private viewCotainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  
  ngOnInit(): void {
    if(this.accountService.roles()?.some((r :string)=> this.appHasRole.includes(r))){
      this.viewCotainerRef.createEmbeddedView(this.templateRef)
    }
    else{
      this.viewCotainerRef.clear();
    }
  }

}
