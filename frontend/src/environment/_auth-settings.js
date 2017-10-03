import { DeviceUUID } from 'device-uuid';

export const VERSION = 'v031017';

const AUTH_LOCALSTORAGE = true;
export const AUTH = {
  STRATEGIES: {
    LOCALSTORAGE: AUTH_LOCALSTORAGE,
    HTTP_ONLY: !AUTH_LOCALSTORAGE,
    UUID: true,
  },
};

const du = new DeviceUUID().parse();
const dua = [
  du.os,
  du.cpuCores,
  du.isDesktop,
  du.isMobile,
  du.isTablet,
  du.isWindows,
  du.isLinux,
  du.isLinux64,
  du.isMac,
  du.isiPad,
  du.isiPhone,
  du.isiPod,
];

export const UUID = du.hashMD5(dua.join(':'));
