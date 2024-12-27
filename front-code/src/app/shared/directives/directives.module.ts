import { NgModule } from '@angular/core';
//import { ScrollBarDirective, HighlightDirective } from './common.directive';
import { ConfirmDirective, NumbersOnlyDirective, TrimDirective } from './common.directive';

@NgModule({
  imports: [],
  declarations: [NumbersOnlyDirective, ConfirmDirective, TrimDirective],
  exports: [NumbersOnlyDirective, ConfirmDirective, TrimDirective]
})
export class DirectivesModule { }