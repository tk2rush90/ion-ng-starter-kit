// 패키지 추가 필요

import static android.app.Activity.RESULT_OK;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.IntentSenderRequest;
import androidx.activity.result.contract.ActivityResultContracts;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.tasks.Task;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.UpdateAvailability;

@CapacitorPlugin(name = "GoogleAppUpdate")
public class GoogleAppUpdatePlugin extends Plugin {
  AppUpdateManager appUpdateManager;

  ActivityResultLauncher<IntentSenderRequest> activityResultLauncher;

  @Override
  public void load() {
    super.load();

    this.appUpdateManager = AppUpdateManagerFactory.create(getContext());

    this.activityResultLauncher = getActivity().registerForActivityResult(
      new ActivityResultContracts.StartIntentSenderForResult(),
      result -> {
        // handle callback
        if (result.getResultCode() != RESULT_OK) {
          System.out.println("Update flow failed! Result code: " + result.getResultCode());
          // If the update is canceled or fails,
          // you can request to start the update again.
        }
      });
  }

  @PluginMethod()
  public void checkForUpdate(PluginCall call) {
    JSObject result = new JSObject();

    try {
      // Returns an intent object that you use to check for an update.
      Task<AppUpdateInfo> appUpdateInfoTask = this.appUpdateManager.getAppUpdateInfo();

      // Checks that the platform will allow the specified type of update.
      appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
        // This example applies an immediate update. To apply a flexible update
        // instead, pass in AppUpdateType.FLEXIBLE
        result.put("updateRequired", appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
          && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE));

        call.resolve(result);
      });
    } catch (Exception e) {
      call.reject(e.getMessage(), e.getMessage(), this.createErrorObject("업데이트 확인에 실패했습니다.", "Failed to check for update."));
    }
  }

  public void startUpdate(AppUpdateInfo appUpdateInfo) {
    appUpdateManager.startUpdateFlowForResult(
      // Pass the intent that is returned by 'getAppUpdateInfo()'.
      appUpdateInfo,
      // an activity result launcher registered via registerForActivityResult
      this.activityResultLauncher,
      // Or pass 'AppUpdateType.FLEXIBLE' to newBuilder() for
      // flexible updates.
      AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build());
  }

  @Override
  protected void handleOnResume() {
    super.handleOnResume();

    this.appUpdateManager
      .getAppUpdateInfo()
      .addOnSuccessListener(
        appUpdateInfo -> {
          if (appUpdateInfo.updateAvailability()
            == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
            // If an in-app update is already running, resume the update.
            appUpdateManager.startUpdateFlowForResult(
              appUpdateInfo,
              this.activityResultLauncher,
              AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build());
          }
        });
  }

  public JSObject createErrorObject(String messageKo, String messageEn) {
    JSObject errorObject = new JSObject();

    errorObject.put("ko", messageKo);
    errorObject.put("en", messageEn);

    return errorObject;
  }
}

