import { DestroyRef, Directive, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive({
  selector: '[appKeepHrefLang]',
})
export class KeepHrefLangDirective implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  private readonly routerLink = inject(RouterLink);

  private readonly activatedRoute = inject(ActivatedRoute);

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
