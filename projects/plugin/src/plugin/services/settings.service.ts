import { inject, Injectable } from '@angular/core';
import {
  PlayButtonAction,
  PlayButtonActionAndroid,
  PlayButtonActionAndroidTv,
  PlayButtonActionIos,
  Settings,
} from '../entities/settings';
import { WakoGlobal, WakoSettingsService } from '@wako-app/mobile-sdk';
import { Platform } from '@ionic/angular';

@Injectable()
export class SettingsService {
  private readonly platform = inject(Platform);
  private readonly storageCategory = 'plugin.helios_settings';

  settings$ = WakoSettingsService.onChangeByCategory<Settings>(this.storageCategory);

  private settings: Settings;

  async get() {
    let settings: Settings = await WakoSettingsService.getByCategory<Settings>(this.storageCategory);

    const defaultSettings = new Settings(this.platform);
    if (!settings) {
      settings = defaultSettings;
    }

    Object.keys(defaultSettings).forEach((key) => {
      if (settings[key] === undefined) {
        settings[key] = defaultSettings[key];
      }
    });

    this.settings = settings;

    return settings;
  }

  async set(settings: Settings) {
    this.settings = settings;

    return await WakoSettingsService.setByCategory(this.storageCategory, settings);
  }

  getPlayButtonActions(isDefaultAction = false) {
    const availablePlayButtonActions = this.getSavedAvailablePlayButtonActions();
    let defaultPlayButtonAction = this.settings.defaultPlayButtonAction;
    if (WakoGlobal && WakoGlobal?.isTvLayout) {
      defaultPlayButtonAction = this.settings.defaultPlayButtonActionTv;
    }

    let actions = isDefaultAction ? [defaultPlayButtonAction] : availablePlayButtonActions;

    if (actions.length === 1 && actions[0] === 'let-me-choose') {
      actions = availablePlayButtonActions;
    }

    return actions;
  }

  getAllAvailablePlayButtonActions() {
    return Settings.getAvailablePlayButtonActions(this.platform, WakoGlobal && WakoGlobal?.isTvLayout).slice(0);
  }

  getSavedDefaultPlayButtonAction() {
    return WakoGlobal && WakoGlobal?.isTvLayout
      ? this.settings.defaultPlayButtonActionTv
      : this.settings.defaultPlayButtonAction;
  }

  getSavedAvailablePlayButtonActions() {
    let availablePlayButtonActions = this.settings.availablePlayButtonActions;
    if (WakoGlobal && WakoGlobal?.isTvLayout) {
      availablePlayButtonActions = this.settings.availablePlayButtonActionsTv;
      if (!availablePlayButtonActions || availablePlayButtonActions.length === 0) {
        availablePlayButtonActions = PlayButtonActionAndroidTv;
      }
    }

    return availablePlayButtonActions;
  }

  setDefaultPlayButtonAction(action: PlayButtonAction, settings: Settings) {
    if (WakoGlobal && WakoGlobal?.isTvLayout) {
      settings.defaultPlayButtonActionTv = action;
    } else {
      settings.defaultPlayButtonAction = action;
    }
  }

  setAvailablePlayButtonActions(actions: PlayButtonAction[], settings: Settings) {
    if (WakoGlobal && WakoGlobal?.isTvLayout) {
      settings.availablePlayButtonActionsTv = actions;
    } else {
      settings.availablePlayButtonActions = actions;
    }
  }
}
