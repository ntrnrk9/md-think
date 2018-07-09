import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDisplay, ErrorInfo } from './common/errorDisplay';
/* Entities */
import { AppUser } from './entities/authDataModel';

const ENTITIES = [
  AppUser
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...ENTITIES,
  ],
})
export class EntityModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: EntityModule,
      providers: [
        ...ENTITIES,
      ],
    };
  }
}

