package com.luru;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.jiagu.sdk.OSETSDKProtected;
import com.kc.openset.OSETListener;
import com.kc.openset.OSETSDK;
import com.kc.openset.OSETVideoListener;
import com.kc.openset.ad.OSETInsertCache;
import com.kc.openset.ad.OSETRewardVideoCache;
import com.kc.openset.listener.OSETInitListener;

/**
 * @author July
 * @time 2023/7/10 11:36
 * @des
 * @updateAuthor
 * @updateDate
 * @updateDes
 */
public class AdUtilsModule extends ReactContextBaseJavaModule {

    private final Handler sHandler = new Handler(Looper.getMainLooper());

    public AdUtilsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void initAd(String appKey) {
        OSETSDKProtected.install(MainApplication.application);
        OSETSDK.getInstance().init(MainApplication.application, appKey, new OSETInitListener() {
            @Override
            public void onError(String s) {
                WritableMap event = Arguments.createMap();
                event.putString("callBackName", "onError");
                event.putString("errorMsg", s);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("initResult", event);
            }

            @Override
            public void onSuccess() {
                WritableMap event = Arguments.createMap();
                event.putString("callBackName", "onSuccess");
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("initResult", event);
            }
        });
    }

    @ReactMethod
    public void initRewardAd(String posId) {
        OSETRewardVideoCache.getInstance()
                .setPosId(posId)
                .setContext(getCurrentActivity())
                .startLoad();
    }

    @ReactMethod
    public void initInsertAd(String posId) {
        OSETInsertCache.getInstance()
                .setPosId(posId)
                .setContext(getCurrentActivity())
                .startLoad();
    }

    @ReactMethod
    public void showLog(String msg) {
        Log.d("七月", "初始化结果=" + msg);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public void showRewardAd(String userId) {
        sHandler.post(() -> {
            OSETRewardVideoCache.getInstance().setUserId(userId).setOSETVideoListener(new OSETVideoListener() {
                @Override
                public void onClick() {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onClick");
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }

                @Override
                public void onClose(String s) {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onClose");
                    event.putString("adId", s);
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }

                @Override
                public void onLoad() {

                }

                @Override
                public void onReward(String s) {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onReward");
                    event.putString("adId", s);
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }

                @Override
                public void onShow(String s) {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onShow");
                    event.putString("adId", s);
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }

                @Override
                public void onVideoEnd(String s) {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onVideoEnd");
                    event.putString("adId", s);
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }

                @Override
                public void onVideoStart() {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onVideoStart");
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }

                @Override
                public void onError(String s, String s1) {
                    WritableMap event = Arguments.createMap();
                    event.putString("callBackName", "onError");
                    event.putString("errorCode", s);
                    event.putString("errorMsg", s1);
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("rewardResult", event);
                }
            }).showAd(getCurrentActivity());
        });
    }

    @ReactMethod
    public void showInsert() {
        sHandler.post(() -> OSETInsertCache.getInstance().setOSETListener(new OSETListener() {
            @Override
            public void onClick() {
                WritableMap event = Arguments.createMap();
                event.putString("callBackName", "onClick");
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("insertResult", event);
            }

            @Override
            public void onClose() {
                WritableMap event = Arguments.createMap();
                event.putString("callBackName", "onClose");
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("insertResult", event);
            }

            @Override
            public void onShow() {
                WritableMap event = Arguments.createMap();
                event.putString("callBackName", "onShow");
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("insertResult", event);
            }

            @Override
            public void onError(String s, String s1) {
                WritableMap event = Arguments.createMap();
                event.putString("callBackName", "onError");
                event.putString("errorCode", s);
                event.putString("errorMsg", s1);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("insertResult", event);
            }
        }).showAd(getCurrentActivity()));
    }

    @NonNull
    @Override
    public String getName() {
        return "AdUtilsModule";
    }


}
