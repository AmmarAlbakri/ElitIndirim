import { NgModule } from '@angular/core';
import { DirPipe } from './dir/dir.pipe';
import { SafePipe } from './safe/safe.pipe';

@NgModule({
  declarations: [DirPipe, SafePipe],
  imports: [],
  exports: [DirPipe, SafePipe]
})

export class PipesModule { }
