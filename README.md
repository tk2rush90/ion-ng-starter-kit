# ion-ng-starter-kit

Angular, Ionic, TailwindCSS가 합쳐진 Ionic Angular Framework 기반 스타터 킷입니다.
모바일과 웹의 빠른 개발을 위해 몇 가지 스니펫 컴포넌트들이 있습니다.

현재 프로젝트는 애프레소 백엔드와 통합되어 있습니다.

# Capacitor 설정

```shell
# 아이오닉 앱 빌드
$ ionic build
```

```shell
# iOS 및 Android 프로젝트 생성
# 생성 전에 capacitor.config.ts 에서 필요한 설정 변경 필요 
$ ionic cap add ios
$ ionic cap add android
```

```shell
# ionic build 시 마다 www 폴더의 내용이 업데이트 되므로 아래 명령어를 이용해
# iOS, Android 프로젝트에 변경사항 반영 필요
# `ionic build` 내부적으로 자동 실행
$ ionic cap copy
```

```shell
# iOS, Android 프로젝트 네이티브 코드의 변경이 있을 경우 아래 명령어 실행
# `ionic build`, `ionic cap copy` 내부적으로 자동 실행
$ ionic cap sync
```

# iOS, Android Live Reload

```shell
# iOS, Android에서 Live Reload 기능을 사용하려면 아래 명령어 사용
# `ionic build`, `ionic cap copy`, `ionic cap sync` 내부적으로 자동 실행
$ ionic cap run ios -l --external
$ ionic cap run android -l --external
```

# Google OAuth Android 플러그인

로그인 처리는 기본적으로 Google OAuth를 이용할 수 있게 디자인 되었습니다.
안드로이드를 위한 개발을 진행하는 경우 안드로이드 프로젝트 내에 별도의 플러그인을 생성해줘야 합니다.

## 의존성 추가

Module의 `build.gradle` 파일에 다음과 같이 의존성을 추가합니다.

```groovy
dependencies {
  ...
  implementation "androidx.credentials:credentials:1.5.0-alpha05"
  // optional - needed for credentials support from play services, for devices running
  // Android 13 and below.
  implementation "androidx.credentials:credentials-play-services-auth:1.5.0-alpha05"
  implementation "com.google.android.libraries.identity.googleid:googleid:1.1.1"
}
```

# MainActivity

기본 MainAc

```java
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(GoogleOauthPlugin.class);
    
    super.onCreate(savedInstanceState);

    // Edge-to-edge 적용. 시스템 바 인셋에 맞춰 콘텐츠를 배치하지 않도록 설정
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
  }
}
```
