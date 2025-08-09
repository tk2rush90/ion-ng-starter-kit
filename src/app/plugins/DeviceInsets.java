// 패키지 추가 필요


import static android.content.ContentValues.TAG;

import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "DeviceInsets")
public class DeviceInsets extends Plugin {
  @PluginMethod()
  public void getInsets(PluginCall call) {
    JSObject result = new JSObject();

    try {
      View rootView = getBridge().getWebView(); // Capacitor 웹뷰의 루트 뷰를 가져옵니다.

      if (rootView == null) {
        call.reject("Root view (WebView) not found.");
        return;
      }

      // 핵심: 현재 윈도우 인셋을 직접 가져옵니다.
      // 이 호출은 onApplyWindowInsetsListener의 콜백 없이 즉시 현재 값을 반환합니다.
      WindowInsetsCompat insets = ViewCompat.getRootWindowInsets(rootView);

      if (insets != null) {
        // systemBars() 타입으로 StatusBar와 NavigationBar의 인셋을 가져옵니다.
        Insets systemBarsInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars());

        // 픽셀 값을 웹에서 사용하기 적합한 DP (Density-Independent Pixel) 값으로 변환
        DisplayMetrics displayMetrics = getContext().getResources().getDisplayMetrics();
        float density = displayMetrics.density;

        result.put("top", (int) (systemBarsInsets.top / density));
        result.put("bottom", (int) (systemBarsInsets.bottom / density));
        result.put("left", (int) (systemBarsInsets.left / density));
        result.put("right", (int) (systemBarsInsets.right / density));

        Log.d(TAG, "Current System Bar Insets (dp): " + result);
        call.resolve(result);

      } else {
        Log.w(TAG, "WindowInsetsCompat is null. Could not get current insets.");
        // Insets를 얻지 못했을 때 기본값 또는 에러 리턴
        result.put("top", 0);
        result.put("bottom", 0);
        result.put("left", 0);
        result.put("right", 0);
        call.resolve(result); // Insets가 없을 수도 있으므로 reject 대신 resolve(0)을 하는 것이 더 유연합니다.
      }

    } catch (Exception e) {
      Log.e(TAG, "Error getting system bar insets", e);
      call.reject("Failed to get system bar insets: " + e.getMessage());
    }
  }
}
