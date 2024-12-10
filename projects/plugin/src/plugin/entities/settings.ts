import { SourceQuality } from './source-quality';
import { inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import { WakoFileActionAndroid, WakoFileActionIos } from '@wako-app/mobile-sdk';

export declare type PlayButtonAction =
  | 'open-kodi'
  | 'open-browser'
  | 'copy-url'
  | 'open-vlc'
  | 'download-vlc'
  | 'share-url'
  | 'open-elementum'
  | 'open-with'
  | 'open-nplayer'
  | 'add-to-pm'
  | 'add-to-rd'
  | 'add-to-ad'
  | 'add-to-playlist'
  | 'open-infuse'
  | 'cast'
  | 'let-me-choose'
  | 'open-outplayer'
  | 'add-to-torbox'
  | 'wako-player';

export const PlayButtonActionIos: PlayButtonAction[] = [
  'open-elementum',
  'copy-url',
  'share-url',
  'open-vlc',
  'download-vlc',
  'open-browser',
  'open-kodi',
  'open-nplayer',
  'add-to-pm',
  'add-to-rd',
  'add-to-ad',
  'add-to-torbox',
  'add-to-playlist',
  'open-infuse',
  'cast',
  'open-outplayer',
];

export const PlayButtonActionAndroid: PlayButtonAction[] = [
  'open-elementum',
  'copy-url',
  'share-url',
  'open-vlc',
  'open-browser',
  'open-kodi',
  'open-with',
  'add-to-pm',
  'add-to-rd',
  'add-to-ad',
  'add-to-torbox',
  'add-to-playlist',
  'cast',
];

export const PlayButtonActionAndroidTv: PlayButtonAction[] = [
  'wako-player',
  'open-vlc',
  'open-with',
  'add-to-pm',
  'add-to-rd',
  'add-to-ad',
  'add-to-torbox',
  'add-to-playlist',
];

export interface SettingsQuality {
  quality: SourceQuality;
  displayName: string;
  enabled: boolean;
}

export interface FileSizeFilter {
  enabled: boolean;
  maxSize: number;
  minSize: number;
}

export interface SourceFilter {
  sortStreamsBy: 'size';
  sortTorrentsBy: 'balanced' | 'size' | 'seeds';
  groupStreamsByQuality: boolean;
  groupTorrentsByQuality: boolean;
  excludeTags: string[];
}

export interface PremiumizeSettings {
  disabled: boolean;
  apiKey: string;
  preferTranscodedFiles: boolean;
  preferTranscodedFilesChromecast: boolean;
}

export interface RealDebridSettings {
  disabled: boolean;
  client_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  client_secret: string;
}

export interface AllDebridSettings {
  disabled: boolean;
  apiKey: string;
  name: string;
}

export interface TorboxSettings {
  disabled?: boolean;
  apiKey: string;
}

export class Settings {
  premiumize: PremiumizeSettings = null;
  realDebrid: RealDebridSettings = null;
  allDebrid: AllDebridSettings = null;
  torbox?: TorboxSettings;

  defaultPlayButtonAction: PlayButtonAction = 'let-me-choose';
  defaultPlayButtonActionTv: PlayButtonAction = 'let-me-choose';

  availablePlayButtonActions: PlayButtonAction[] = [];
  availablePlayButtonActionsTv: PlayButtonAction[] = [];

  qualities: SettingsQuality[] = [
    {
      quality: '2160p',
      displayName: '2160p/4k',
      enabled: false,
    },
    {
      quality: '1080p',
      displayName: '1080p',
      enabled: true,
    },
    {
      quality: '720p',
      displayName: '720p',
      enabled: false,
    },
    {
      quality: 'other',
      displayName: 'Other',
      enabled: false,
    },
  ];

  openRemoteAfterClickOnPlay = true;
  enableEpisodeAutomaticPlaylist = true;

  fileSizeFilteringMovie: FileSizeFilter = {
    enabled: false,
    maxSize: 0,
    minSize: 0,
  };

  fileSizeFilteringTv: FileSizeFilter = {
    enabled: false,
    maxSize: 0,
    minSize: 0,
  };

  defaultTitleLang = 'en';

  sourceFilter: SourceFilter = {
    sortStreamsBy: 'size',
    sortTorrentsBy: 'balanced',
    groupStreamsByQuality: true,
    groupTorrentsByQuality: true,
    excludeTags: [],
  };

  simultaneousProviderQueries = 0;

  constructor(platform: Platform) {
    const wakoAction = platform.is('ios') ? WakoFileActionIos : WakoFileActionAndroid;
    const playButtonAction = platform.is('ios') ? PlayButtonActionIos : PlayButtonActionAndroid;

    // default actions
    this.availablePlayButtonActions = ['open-kodi', 'cast', 'open-vlc', 'share-url'];

    if (wakoAction.includes('wako-video-player')) {
      this.availablePlayButtonActions.unshift('wako-player');
      playButtonAction.unshift('wako-player');
    }

    this.availablePlayButtonActionsTv = PlayButtonActionAndroidTv;
  }
}
