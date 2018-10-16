import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { NotasComponent } from './notas/notas.component';
import { ProductosComponent } from './productos/productos.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [UserComponent, NotasComponent, ProductosComponent]
})
export class UserModule { }