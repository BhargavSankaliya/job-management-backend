import { NgModule } from '@angular/core';
import { ArraySortPipe, NiceDateFormatPipe, KeyValuePipe, SearchFilterPipe } from './common.pipe';

@NgModule({
  imports: [],
  declarations: [ArraySortPipe, NiceDateFormatPipe, KeyValuePipe, SearchFilterPipe],
  exports: [ArraySortPipe, NiceDateFormatPipe, KeyValuePipe, SearchFilterPipe]
})
export class PipeModule { }
