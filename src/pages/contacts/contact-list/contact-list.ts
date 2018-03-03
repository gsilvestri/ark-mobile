import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, AlertController, ActionSheetController } from 'ionic-angular';

import { UserDataProvider } from '@providers/user-data/user-data';
import { ContactsProvider } from '@providers/contacts/contacts';

import { TranslateService } from '@ngx-translate/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import lodash from 'lodash';
import { AddressMap } from '@models/contact';

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  public profile;
  public network;
  public addresses: AddressMap[];

  private unsubscriber$: Subject<void> = new Subject<void>();

  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private userDataProvider: UserDataProvider,
    private contactsProvider: ContactsProvider,
    private translateService: TranslateService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  presentContactActionSheet(address) {
    this.translateService.get(['EDIT', 'DELETE']).takeUntil(this.unsubscriber$).subscribe((translation) => {
      const buttons = [
        {
          text: translation.EDIT,
          role: 'label',
          icon: !this.platform.is('ios') ? 'ios-create-outline' : '',
          handler: () => {
            this.openEditPage(address);
          },
        }, {
          text: translation.DELETE,
          role: 'label',
          icon: !this.platform.is('ios') ? 'ios-trash-outline' : '',
          handler: () => {
            this.showDeleteConfirm(address);
          },
        }
      ];

      const action = this.actionSheetCtrl.create({buttons});
      action.present();
    });
  }

  showDeleteConfirm(address) {
    this.translateService.get([
      'CANCEL',
      'CONFIRM',
      'ARE_YOU_SURE',
    ]).subscribe((translation) => {
      const alert = this.alertCtrl.create({
        title: translation.ARE_YOU_SURE,
        buttons: [
          {
            text: translation.CANCEL
          },
          {
            text: translation.CONFIRM,
            handler: () => {
              this.delete(address);
            }
          }
        ]
      });

      alert.present();
    });
  }

  isEmpty() {
    return lodash.isEmpty(this.addresses);
  }

  delete(address) {
    this.contactsProvider.removeContactByAddress(address);
    this._load();
  }

  openEditPage(address) {
    const contact = this.contactsProvider.getContactByAddress(address);
    return this.navCtrl.push('ContactCreatePage', {contact});
  }

  openCreatePage() {
    return this.navCtrl.push('ContactCreatePage');
  }

  private _load() {
    this.profile = this.userDataProvider.currentProfile;
    this.network = this.userDataProvider.currentNetwork;

    this.addresses = lodash(this.profile.contacts).mapValues('name').transform((result, key, value) => {
      result.push({ index: value, value, key });
    }, []).value();
  }

  ionViewDidLoad() {
    this._load();
  }
}
