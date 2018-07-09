import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
/* Services */
// used to create fake backend
import { fakeBackendProvider } from './_helpers/index';
import { environment } from '../../environments/environment';
const FAKES = [
  fakeBackendProvider
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...FAKES,
  ],
})
export class FakeServiceModule {
  static forRoot(): ModuleWithProviders {
    if (!environment.fakeHttpResponse) {
      return <ModuleWithProviders>{};
    } else {
      return <ModuleWithProviders>{
        ngModule: FakeServiceModule,
        providers: [
          ...FAKES,
        ],
      };
    }
  }
}
