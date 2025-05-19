import { Component } from '@angular/core';
import { HomeBannerComponent } from '../../components/app/home-banner/home-banner.component';
import { SectionHeaderComponent } from '../../components/app/section-header/section-header.component';
import { SectionTitleComponent } from '../../components/app/section-title/section-title.component';
import { IconHouseComponent } from '../../components/icons/icon-house/icon-house.component';
import { DropdownComponent } from '../../components/app/dropdown/dropdown.component';
import { DropdownOption } from '../../data/dropdown-options';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostListComponent } from '../../components/app/post-list/post-list.component';
import { CanonicalService } from '../../services/app/canonical/canonical.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-page',
  imports: [
    HomeBannerComponent,
    SectionHeaderComponent,
    SectionTitleComponent,
    IconHouseComponent,
    DropdownComponent,
    PostListComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  order: string | null = null;

  options: DropdownOption[] = [
    {
      label: '최신순',
      value: 'latest',
    },
    {
      label: '인기순',
      value: 'popular',
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly canonicalService: CanonicalService,
  ) {
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((paramMap) => {
        this.order = paramMap.get('order');
      });

    this.canonicalService.addOrUpdate(environment.host.frontend);
  }

  get currentOption(): DropdownOption {
    return (
      this.options.find((option) => option.value === this.order) ||
      this.options[0]
    );
  }

  onOptionChange(option: DropdownOption): void {
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: {
        order: option.value,
      },
      queryParamsHandling: 'merge',
    });
  }
}
