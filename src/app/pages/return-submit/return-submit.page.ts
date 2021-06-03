import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, Validators } from '@angular/forms';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController, Platform, Events, NavController } from '@ionic/angular';
import { Camera, PictureSourceType, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { LoadingService } from '../../services/loading/loading.service';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order/order.service';
import { Storage } from '@ionic/storage';
import { ToastService } from '../../services/toast/toast.service';

const STORAGE_KEY = 'my_images';


@Component({
  selector: 'app-return-submit',
  templateUrl: './return-submit.page.html',
  styleUrls: ['./return-submit.page.scss'],
})
export class ReturnSubmitPage implements OnInit {

  id;


  // options = [this.translte.instant("yes"), this.translte.instant("no")];
  options = ["yes", "no"];

  message = new FormControl('', [
    Validators.required,
  ]);
  reason = new FormControl('', [
    Validators.required,
  ]);

  isRecieved;
  isRecievedError = null;
  isUsed;
  isUsedError = null;

  messageError = false;
  reasonError = false;


  /////////////////
  public choosedImage = [];
  public choosedImageURL = [];
  public formData = new FormData();
  public isDeleting = false;


  constructor(
    private translate: TranslateService,
    private webview: WebView,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private platform: Platform,
    private filePath: FilePath,
    private file: File,
    private orderService: OrderService,
    private storage: Storage,
    private ref: ChangeDetectorRef,
    private loading: LoadingService,
    private route: ActivatedRoute,
    public events: Events,
    private toast: ToastService, private navCtrl: NavController) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
  }


  checkMessage() {
    this.message.markAsTouched();
    if (this.message.valid) {
      this.messageError = false;
    } else {
      this.messageError = true;
    }
  }

  checkReason() {
    this.reason.markAsTouched();
    if (this.reason.valid) {
      this.reasonError = false;
    } else {
      this.reasonError = true;
    }
  }

  recivedChanged() {
    this.isRecievedError = false;
    console.log(this.isRecieved);
  }
  usedChanged() {
    this.isUsedError = false;
    console.log(this.isUsed);
  }

  ionViewDidLeave() {
    this.clearLocalStorage();
  }

  // Mark: *****Images******
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      const converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async  addPhotoAlert() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [{
        text: this.translate.instant('take_photo'),
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: this.translate.instant('choose_photo'),
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: this.translate.instant('cancel'),
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType,
      allowEdit: false,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).catch(err => {
      console.log('err ', err);
    }).then(imagePath => {
      console.log('imgP: ', imagePath);
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('filePath: ', filePath);
            const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });
  }

  createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      // this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);
      if (!arr) {
        const newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      const filePath = this.file.dataDirectory + name;
      const resPath = this.pathForImage(filePath);

      const newEntry = {
        name,
        path: resPath,
        filePath
      };

      this.choosedImage = [newEntry, ...this.choosedImage];

      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  deleteImage(imgEntry, position) {
    // this.loading.presentLoading();
    console.log('delImg:', position);

    this.isDeleting = true;
    this.choosedImage.splice(position, 1);

    // this.slides.update().then(() => {
    //   console.log('slides updated');
    setTimeout(() => {
      this.isDeleting = false;
    }, 10);
    // }).catch(err => {
    //   console.log('err in update ', err);
    // });

    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);

      const filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        console.log('file removed from storage');
        // this.presentToast('File removed.');
      }).catch(err => {
        console.log('error removing from storage 1: ', err);
        // this.loading.loading.dismiss();
      });
    }).catch((error) => {
      console.log('error removing from storage 2: ', error);
    });

  }

  clearLocalStorage() {
    //getting images pathes from storage
    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);

      this.choosedImage.forEach((imgEntry, i) => {
        const filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
        const correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
        this.file.removeFile(correctPath, imgEntry.name).then(res => {
          console.log('file removed from storage', res);
          if (this.choosedImage.length - 1 == i) {
            setTimeout(() => {
              this.storage.clear();
              this.file.removeRecursively(this.file.dataDirectory, 'tmp/')
                .then((result) => {
                  console.log('result of removing temp files: ', JSON.stringify(result));
                  // this.storage.clear();
                  this.file.createDir(this.file.applicationStorageDirectory, 'tmp/', false)
                    .then((response) => {
                      console.log('tmp created! ', response);
                    })
                    .catch((error) => {
                      console.log('error creating tmp: ', error);
                    });
                }).catch(err => console.log('err removing all temp files: ', err));
              console.log('all files removed from storage');
            }, 100);
          }
        }).catch(err => {
          console.log('error removing from storage 1: ', err);
          // this.loading.loading.dismiss();
        });
      });

    }).catch((error) => {
      console.log('error removing from storage 2: ', error);
    });
  }

  sendRequest() {
    const noError = this.checkAll();
    if (noError) {
      if (this.choosedImage.length > 0) {
        this.uploadImages();
      }
      else {
        this.sendRequestData();
      }
    }
  }

  uploadImages() {
    console.log('chsdImgs: ', JSON.stringify(this.choosedImage));
    this.formData = new FormData();
    this.choosedImage.forEach((image, i) => {
      this.file.resolveLocalFilesystemUrl(image.filePath)
        .then(entry => {
          (entry as FileEntry).file((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              console.log('FT: ', file.type);
              const imgBlob = new Blob([reader.result], {
                type: file.type
              });
              this.formData.append('images', imgBlob, file.name);
              if (this.choosedImage.length - 1 == i) {
                setTimeout(() => {
                  this.uploadImagesData();
                }, 100);
              }
            };
            reader.readAsArrayBuffer(file);
          });
        }).catch((err) => {
          console.log('Error in images ', err);
        });
    });
  }

  async uploadImagesData() {
    console.log('frmData: ', this.formData);
    this.orderService.uploadImage(this.formData)
      .subscribe((response) => {
        console.log('resp: ', response);
        this.choosedImageURL = response.data[0];
        console.log(this.choosedImageURL);
        this.sendRequestData();
      }, error => {
        this.loading.loading.dismiss();
        this.events.publish('Request:Error', error);
        console.log('resp error: ', JSON.stringify(error));
      });
  }

  checkAll() {
    this.checkMessage();
    this.checkReason();
    if (this.isRecievedError == null) {
      this.isRecievedError = true;
    }
    if (this.isUsedError == null) {
      this.isUsedError = true;
    }
    if (!this.messageError
      && !this.reasonError
      && !this.isRecievedError
    ) {
      if (this.isRecieved == 'yes') {
        if (this.isUsedError) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }

  }

  sendRequestData() {
    this.loading.presentLoading();
    let body;
    if (this.choosedImage.length <= 0) {
      body = {
        "reciveOrder": this.isRecieved == 'yes' ? true : false,
        "userNote": this.message.value,
        "refundResone": this.reason.value,
        "order": this.id,
        "isUsed": this.isUsed == 'yes' ? true : false,
        "images": []
      };
    } else {
      body = {
        "reciveOrder": this.isRecieved == 'yes' ? true : false,
        "userNote": this.message.value,
        "refundResone": this.reason.value,
        "order": this.id,
        "isUsed": this.isUsed == 'yes' ? true : false,
        "images": [this.choosedImageURL]
      };
    }

    console.log("body:", body);

    this.orderService.sendRetunRequest(body)
      .subscribe(data => {
        console.log(data);
        this.loading.loading.dismiss();
        this.toast.presentToast("success", this.translate.instant("request_sent_successfuly"));
        this.navCtrl.back();
      }, error => {
        console.log(error);
        this.events.publish("Request:Error", error);
        this.loading.loading.dismiss();
      });
  }
}
