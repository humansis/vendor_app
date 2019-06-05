#!/bin/zsh
# *************************************************
# To make the script work you just need to copy it in the parent's folder to the project
# you want to generate the apk for.
# You also need to copy, in the same parent directory, the zipalign folder
# *************************************************
directory=`dirname $0`
directoryApp=`pwd`
release_app_folder='/platforms/android/app/build/outputs/apk/release'
unsigned_app_folder="$directoryApp$release_app_folder"

echo The directory of the jar script is: $directoryApp
echo The directory of the unsigned apk is: $unsigned_app_folder

nom_keystore=''
nom_app=''
user_choice=''
keystore_password=''
timestampname=$(date +%s)
log_message_start='***************** STARTING *****************'
log_message_end='****************** ENDING *******************'

vared -p 'Are you sure you want to generate the signed app? (y/n) ' user_choice
if [[ $user_choice = 'y' ]]; then
    vared -p 'What is the keystore file name (without the extension)? ' nom_keystore
    vared -p 'What is the App Name file name (without the extension)? ' nom_app
    vared -p 'What is the keystore password? ' keystore_password
    echo $log_message_start
    echo jarsigner about to start
    echo $log_message_end
    cd $unsigned_app_folder
    echo $keystore_password | jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $directoryApp/$nom_keystore.keystore app-release-unsigned.apk $nom_app 
    echo $log_message_start
    echo jarsigner finished, copy of zipalign to start
    echo $log_message_end
    cd $directoryApp
    cp ./zipalign $unsigned_app_folder
    echo $log_message_start
    echo copy of zipalign finished, moving to the release folder and generating the signed apk
    echo $log_message_end
    cd $unsigned_app_folder
    mv $nom_app.apk $nom_app.apk.$timestampname
    ./zipalign -v 4 app-release-unsigned.apk $nom_app.apk
  else
    if [[ $user_choice = 'n' ]]; then
      echo You said no
    else
      echo "Error: you should type only y or n"
    fi

fi
