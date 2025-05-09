import { DestroyRef, Directive, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appKeepHrefLang]',
})
export class KeepHrefLangDirective implements OnInit {
  constructor(
    private readonly destroyRef: DestroyRef,
    private readonly routerLink: RouterLink,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((paraMap) => {
        const hl = paraMap.get('hl');

        if (hl) {
          this.routerLink.queryParams = {
            ...(this.routerLink.queryParams || {}),
            hl,
          };
        }
      });
  }
}
