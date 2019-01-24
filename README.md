# bms_vendor_app
Mobile applications for vendors - part of the BMS vendor module

- Developped with ionic 3


## Resources

Here is the ionic v3 documentation : https://ionicframework.com/docs/


## Installation

```
git clone https://github.com/ReliefApplications/bms_vendor_app.git
npm install -g cordova ionic
npm i
```
    

## Platforms

```ionic cordova platform add android```


## Plugins

```ionic cordova plugin add phonegap-plugin-barcodescanner```
```ionic cordova plugin add cordova-plugin-screen-orientation```


## Packages

```npm install --save @ionic-native/barcode-scanner```
```npm install @ionic-native/screen-orientation```


## Testing

To run on Android :

1) ```ionic cordova run android```

---

To run on iOS (works only from an OSX):

1) ```ionic cordova build ios```
2) Open relief_jobs/platforms/ios/relief_jobs.workspace with Xcode
3) Select your device 
4) Click on the RUN button


## Deployment

Google Play Store (Android)
    
1) Update config.xml

2) RUN ```ionic cordova platform rm android```

3) RUN ```ionic cordova platform add android```

4) RUN ```ionic cordova build android --release```

5) Be sure to have credentials (app_password file) and original_keystore (relief_jobs.keystore file)

    a) They are located at the root of the project or on Dropbox

6) Be sure to copy/paste the zipalign tool from the relief_jobs folder to the platforms/android/app/build/outputs/apk/release folder

7) In the relief_jobs/

    a) RUN ```./signApp.sh``` and follow the instructions

    b) Upload the relief_jobs.apk on Google Play Store with deploys.reliefapps@gmail.com account

--- 

Apple Store (iOS)

0) Generate the provisionning profile & the certificates in Apple Store Developer Website

1) RUN ```ionic cordova build ios```

2) Open relief_jobs/platforms/ios/relief_jobs.workspace with Xcode

3) Product/Destination/iOS generic device

4) Product/Build 

5) Product/Archived

6) A new windows will appear.

    a) Validate
    
    b) Export

7) XCode - Open Developper Tool/Applications Loader

8) Select the .ipa file generated at step 6

9) Upload

10) You will receive an email from Apple

11) In apple store console

     a) TestFlight 

     b) Complete all required fields

     c) Submit for review

12) When Review is completed, you can deploy on the store.
