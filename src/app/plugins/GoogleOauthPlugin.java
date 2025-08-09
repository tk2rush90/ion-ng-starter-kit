// 패키지 추가 필요

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
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
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
    String clientId = call.getString("clientId");

    GetSignInWithGoogleOption getSignInWithGoogleOption = new GetSignInWithGoogleOption.Builder(clientId).build();

    GetCredentialRequest getCredentialRequest = new GetCredentialRequest.Builder().addCredentialOption(getSignInWithGoogleOption).build();

    Context context = getContext();

    try {
      this.credentialManager.getCredentialAsync(context, getCredentialRequest, null, context.getMainExecutor(), new CredentialManagerCallback<>() {
        @Override
        public void onResult(GetCredentialResponse getCredentialResponse) {
          handleSignIn(getCredentialResponse, call);
        }

        @Override
        public void onError(@NonNull GetCredentialException e) {
          call.reject(e.getMessage(), e.getMessage(), createErrorObject("로그인 준비 과정에서 오류가 발생했습니다: " + e.getMessage(), "Failed to prepare Google Log In: " + e.getMessage()));
        }
      });
    } catch (Exception e) {
      call.reject(e.getMessage(), e.getMessage(), this.createErrorObject("로그인 준비 과정에서 오류가 발생했습니다: " + e.getMessage(), "Failed to prepare Google Log In: " + e.getMessage()));
    }
  }

  public void handleSignIn(GetCredentialResponse getCredentialResponse, PluginCall call) {
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

  public JSObject createErrorObject(String messageKo, String messageEn) {
    JSObject errorObject = new JSObject();

    errorObject.put("ko", messageKo);
    errorObject.put("en", messageEn);

    return errorObject;
  }
}
