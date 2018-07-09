import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from './common/module-import-guard';
import { EntityModule } from './entity.module';
import { ServiceModule } from './service.module';
import { GuardModule } from './guard.module';
import { ErrorDisplay } from './common/errorDisplay';

const NB_CORE_PROVIDERS = [
  ...EntityModule.forRoot().providers,
  ...ServiceModule.forRoot().providers,
  ...GuardModule.forRoot().providers
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [],
  declarations: [ErrorDisplay],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
