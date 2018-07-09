import { Directive, ElementRef, Input, Renderer, HostBinding, Attribute, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[perm-Key]'
})
export class FieldPermissionDirective implements OnInit {

  @Input() permKey: string;

  constructor(private route: ActivatedRoute,
    private el: ElementRef,
    private renderer: Renderer) {
  }
  ngOnInit() {
    if (this.permKey) {
      if (this.route.data['screen'] && !this.route.data['screen'].skip) {
        // const permission = this.permissionService.getPermission(this.route.data['screen'].current);
        // if (permission) {
        //   const field = permission.fieldPermissions.filter(item => item.fieldName === this.permKey);
        //   if (!field && !field.length) {
        //     if (!field[0].fieldAttributes && !field[0].fieldAttributes.length) {
        //       field[0].fieldAttributes.forEach(item => {
        //         this.renderer.setElementStyle(this.el.nativeElement, item.key, item.value);
        //       });
        //     }
        //   }
        // }
      }
    }
  }
}
