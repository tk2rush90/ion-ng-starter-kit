# ion-ng-starter-kit

Angular, Ionic, TailwindCSS가 합쳐진 Ionic Angular Framework 기반 스타터 킷입니다.
모바일과 웹의 빠른 개발을 위해 몇 가지 스니펫 컴포넌트들이 있습니다.

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
$ ionic cap copy
```

```shell
# iOS, Android 프로젝트 네이티브 코드의 변경이 있을 경우 아래 명령어 실행
$ ionic cap sync
```

# iOS, Android Live Reload

```shell
# iOS, Android에서 Live Reload 기능을 사용하려면 아래 명령어 사용
$ ionic cap run ios -l --external
$ ionic cap run android -l --external
```

