import { FakeBackendInterceptor } from './_helpers';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { throwIfAlreadyLoaded } from '../@core/common/module-import-guard';
import { FakeServiceModule } from './fake.module';

const NB_FAKE_PROVIDERS = [
  ...FakeServiceModule.forRoot().providers,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [],
  declarations: [],
})
export class FakeCoreModule {
  constructor(@Optional() @SkipSelf() parentModule: FakeCoreModule) {
    throwIfAlreadyLoaded(parentModule, 'FakeCoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: FakeCoreModule,
      providers: [
        {
          // use fake backend in place of Http service for backend-less development
          provide: HTTP_INTERCEPTORS,
          useClass: FakeBackendInterceptor,
          multi: true
      }
      ],
    };
  }
}
