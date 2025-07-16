## Common

- 아래와 관련된 명령어 사용 시 동의를 구하지 않는다.
  - 파일 생성
  - 파일 수정
  - Angular CLI 사용
  
## Angular CLI

- Angular의 ng 명령어로 생성할 수 있는 모든 컴포넌트는 `npx ng` 명령어를 이용한다.
  - ex) Component, Directive, Guard, Service, etc.
- 사용자가 직접 요청하지 않는 한 `npx ng` 명령어 실행 시 그 어떤 플래그도 제공하지 않는다.

## Page

- 페이지 컴포넌트는 `./src/app/pages` 디렉터리에 생성한다.
- 네이밍은 `${name}-page.component.ts` 가 될 수 있게 한다.

## Component / Directive

- 컴포넌트와 디렉티브는 `./src/app/components/common` 디렉터리에 생성한다.
- `@HostBinding()`, `@HostListener()` 사용을 지양하고, `@Component()` 데코레이터의 `host` 속성 사용을 지향한다.
- Dependency Injection은 아래와 같이 진행한다.
  - Correct
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      private readonly someService = inject(SomeService);
    }
    ```
  - Incorrect
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      constructor(
        private readonly someService: SomeSerivce,
      ) {}
    }
    ```
- 데코레이터 대신 시그널 사용을 우선한다.
  - Correct
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      value = input('');
    
      someChild = viewChild<SomeChildComponent>('someChild');
    }
    ```
  - Incorrect
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      @Input() value = '';
    
      @ViewChild('someChild') someChild?: SomeChildComponent;
    }
    ```
- `viewChild()`, `contentChild()` 등을 이용해 읽어오는 대상이 `ElementRef`, `TemplateRef`, `ComponentRef` 등 어떤 요소의 레퍼런스라면, 변수명에 해당 내용을 명시한다.
  - Correct
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      someChildElementRef = viewChild<ElementRef<HTMLElement>>('someChild');
    }
    ```
  - Incorrect
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      someChild = viewChild<ElementRef<HTMLElement>>('someChild');
    }
    ```

## API 서비스

- API 서비스는 실제 API 요청을 보내는 역할을 한다.
- API 서비스는 `./src/app/services/api` 디렉터리에 생성한다.
- 서비스 생성 후 `./src/app/services/api/api-service.ts` 의 `ApiService` 를 extends 한 후 생성자에서 super를 통해 호스트 경로를 전달한다.
  - ex)
    ```ts
    @Injectable({
      providedIn: 'root',
    })
    export class SomeApiService extends ApiService {
      constructor() {
        super(environment.host.backend + '/path-prefix-of-api');
      }
    }
    ```
- API 서비스 네이밍은 `${name}-api.service.ts` 가 될 수 있도록 한다.

## CRUD 서비스

- CRUD 서비스는 API 서비스와의 브릿지 역할을 한다.
- CRUD 서비스는 `./src/app/services/app` 디렉터리에 생성한다.
- CRUD 서비스는 기본적으로 컴포넌트의 `providers`를 통해서만 제공될 수 있게 구성한다.
- 서비스 생성 후 `./src/app/services/app/crud/crud.service.ts` 의 `CrudService` 를 extends 하며, 생성자에서 super에 아무것도 전달하지 않는다.
- 서비스 생성 시 extends 한 `CrudService` 의 제너릭에는 `any`를 우선 사용한다.
- CRUD 서비스 네이밍은 `${name}.service.ts` 가 될 수 있도록 한다.
- `fetch()`, `create()`, `update()`, `delete()` 메서드가 구현됨에 따라 제너릭을 적절하게 변환한다.
- `fetch()`, `create()`, `update()`, `delete()` 메서드 구현 시 기존 메서드를 override 하며, 내부적으로 `handle...Observable()` 메서드를 이용해 API 요청을 처리한다.
- Dependency Injection은 아래와 같이 진행한다.
  - Correct
    ```ts
    @Injectable()
    export class SomeService extends CrudService<any> {
      private readonly someApiService = inject(SomeApiService);
    }
    ```
  - Incorrect
    ```ts
    @Injectable()
    export class SomeService extends CrudService<any> {
      constructor(
        private readonly someApiService: SomeApiSerivce,
      ) {
        super();
      }
    }
    ```

## Overlay

- 컴포넌트 내에서 특정 오버레이를 열게 해달라고 하면 다음과 같이 구성한다.
  - ex) some-overlay 를 오버레이로 열 수 있게 해줘.
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      someOverlayTemplateRef = viewChild<TemplateRef<any>>('someOverlay');
    
      private readonly destroyRef = inject(DestroyRef);
    
      private readonly overlayService = inject(OverlayService);
    
      openSomeOverlay(): void {
        const someOverlayTemplateRef = this.someOverlayTemplateRef();
    
        if (someOverlayTemplateRef) {
          this.overlayService.open(someOverlayTemplateRef, {
            destroyRef,  
          })    
        }
      }
    }
    ```
- 컴포넌트 내에서 특정 오버레이를 열고 닫을 수 있게 해달라고 하면 다음과 같이 구성한다.
  - ex) some-overlay 를 오버레이로 열고 닫을 수 있게 해줘.
    ```ts
    @Component({
      selector: 'app-selector',
      templateUrl: 'app-selector.component.html',
      styleUrl: 'app-selector.component.scss',
    })
    export class SelectorComponent {
      someOverlayTemplateRef = viewChild<TemplateRef<any>>('someOverlay');
    
      someOverlayOverlayRef?: OverlayRef;
    
      private readonly destroyRef = inject(DestroyRef);
    
      private readonly overlayService = inject(OverlayService);
    
      openSomeOverlay(): void {
        const someOverlayTemplateRef = this.someOverlayTemplateRef();
    
        if (someOverlayTemplateRef) {
          this.someOverlayOverlayRef = this.overlayService.open(someOverlayTemplateRef, {
            destroyRef,  
            onDestroy: () => delete this.someOverlayOverlayRef,
          })    
        }
      }
    
      closeSomeOverlay(): void {
        this.someOverlayOverlayRef?.close();
      }
    }
    ```
