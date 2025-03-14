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

## GoogleOauthPlugin 클래스 생성

아래와 같이 `GoogleOauthPlugin` 클래스를 생성합니다.


```java
package io.ionic.starter;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.PublicKeyCredential;
import androidx.credentials.exceptions.GetCredentialException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetGoogleIdOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "GoogleOauth")
public class GoogleOauthPlugin extends Plugin {
  CredentialManager credentialManager;

  @Override
  public void load() {
    super.load();

    this.credentialManager = CredentialManager.create(getContext());
  }

  @PluginMethod()
  public void signIn(PluginCall call) {
    GetGoogleIdOption getGoogleIdOption = new GetGoogleIdOption.Builder().setFilterByAuthorizedAccounts(true).setServerClientId("588950841496-i6vd05a8f2k8lvid5pj8evrobksn7tc6.apps.googleusercontent.com").setAutoSelectEnabled(true).build();

    GetCredentialRequest getCredentialRequest = new GetCredentialRequest.Builder().addCredentialOption(getGoogleIdOption).build();

    Context context = getContext();

    this.credentialManager.getCredentialAsync(context, getCredentialRequest, null, context.getMainExecutor(), new CredentialManagerCallback<>() {
      @Override
      public void onResult(GetCredentialResponse getCredentialResponse) {
        Credential credential = getCredentialResponse.getCredential();

        Log.i("Credential Type", credential.getType());

        if (credential instanceof PublicKeyCredential) {
          String authenticationResponseJson = ((PublicKeyCredential) credential).getAuthenticationResponseJson();

          try {
            call.resolve(JSObject.fromJSONObject(new JSONObject(authenticationResponseJson)));
          } catch (JSONException e) {
            call.reject(e.getMessage());
          }
        } else if (credential.getType().equals(GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL)) {
          GoogleIdTokenCredential googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.getData());

          JSObject jsObject = new JSObject();

          jsObject.put("id", googleIdTokenCredential.getId());
          jsObject.put("idToken", googleIdTokenCredential.getIdToken());
          jsObject.put("givenName", googleIdTokenCredential.getGivenName());
          jsObject.put("familyName", googleIdTokenCredential.getFamilyName());
          jsObject.put("displayName", googleIdTokenCredential.getDisplayName());
          jsObject.put("profilePictureUri", googleIdTokenCredential.getProfilePictureUri());

          call.resolve(jsObject);
        } else {
          call.reject("Invalid Signing Method");
        }
      }

      @Override
      public void onError(@NonNull GetCredentialException e) {
        call.reject(e.getMessage());
      }
    });
  }
}
```

## 플러그인 등록

`MainActivity` 클래스에서 플러그인을 등록해줍니다.

```java
package io.ionic.starter;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(GoogleOauthPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
```
