import {Config} from '../config';
import {requestBody} from '../http_utils';

import {BinaryUrl} from './binary';
import {XmlConfigSource} from './config_source';

export class ChromeXml extends XmlConfigSource {
  maxVersion = Config.binaryVersions().maxChrome;

  constructor() {
    super('chrome', Config.cdnUrls()['chrome']);
  }

  getUrl(version: string): Promise<BinaryUrl> {
    if (version === 'latest') {
      return this.getLatestChromeDriverVersion();
    } else {
      return this.getSpecificChromeDriverVersion(version);
    }
  }

  /**
   * Get a list of chrome drivers paths available for the configuration OS type and architecture.
   */
  getVersionList(): Promise<string[]> {
    return this.getContent('json').then(response => {
      let versionPaths: string[] = [];
      let osType = this.getOsTypeName();

      let json = JSON.parse(response);

      for (let milestone in json.milestones) {
        const milestoneData = json.milestones[milestone];
        const downloads = milestoneData.downloads;
        if ('chromedriver' in downloads) {
          for (let download of downloads.chromedriver) {
            let platform: string = download.platform;
            if (
                // Filter for 32-bit devices, make sure x64 is not an option
                (this.osarch.includes('64') || !platform.includes('64')) &&
                // Filter for x86 macs, make sure m1 is not an option
                ((this.ostype === 'Darwin' && this.osarch === 'arm64') ||
                 !platform.includes('m1'))) {
              // Filter for only the osType
              if (platform.includes(osType)) {
                versionPaths.push(download.url);
              }
            }
          }
        }
      }
      return versionPaths;
    });
  }

  /**
   * Helper method, gets the ostype and gets the name used by the XML
   */
  getOsTypeName(): string {
    // Get the os type name.
    if (this.ostype === 'Darwin') {
      return 'mac';
    } else if (this.ostype === 'Windows_NT') {
      return 'win';
    } else {
      return 'linux';
    }
  }

  getOsArmName() {
    // Get the os type name.
    if (this.ostype === 'Darwin') {
      return this.osarch === 'x64' ? 'x64' : 'arm64';
    } else if (this.ostype === 'Windows_NT') {
      return this.osarch === 'x64' ? 'win64' : 'win32';
    } else {
      return 'linux64';
    }
  }

  /**
   * Gets the latest item from the XML.
   */
  private getLatestChromeDriverVersion(): Promise<BinaryUrl> {
    const latestReleaseUrl =
        'https://googlechromelabs.github.io/chrome-for-testing/LATEST_RELEASE_STABLE';
    return requestBody(latestReleaseUrl).then(latestVersion => {
      return this.getSpecificChromeDriverVersion(latestVersion);
    });
  }

  /**
   * Gets a specific item from the XML.
   */
  private getSpecificChromeDriverVersion(inputVersion: string): Promise<BinaryUrl> {
    return this.getVersionList().then(list => {
      let itemFound: string = '';

      for (let item of list) {
        // Get a semantic version.
        let version: string = item.split('/')[4];

        if (inputVersion !== version) {
          continue;
        }
        if (item.includes(this.getOsTypeName()) && item.includes(this.getOsArmName())) {
          itemFound = item;
          break;
        }
      }
      if (itemFound == '') {
        return {url: '', version: inputVersion};
      } else {
        return {url: itemFound, version: inputVersion};
      }
    });
  }
}

/**
 * Chromedriver is the only binary that does not conform to semantic versioning
 * and either has too little number of digits or too many. To get this to be in
 * semver, we will either add a '.0' at the end or chop off the last set of
 * digits. This is so we can compare to find the latest and greatest.
 *
 * Example:
 *   2.46 -> 2.46.0
 *   75.0.3770.8 -> 75.0.3770
 *
 * @param version
 */
export function getValidSemver(version: string): string {
  let lookUpVersion = '';
  // This supports downloading 2.46
  try {
    const oldRegex = /(\d+.\d+)/g;
    const exec = oldRegex.exec(version);
    if (exec) {
      lookUpVersion = exec[1] + '.0';
    }
  } catch (_) {
    // no-op: is this is not valid, do not throw here.
  }
  // This supports downloading 74.0.3729.6
  try {
    const newRegex = /(\d+.\d+.\d+).\d+/g;
    const exec = newRegex.exec(version);
    if (exec) {
      lookUpVersion = exec[1];
    }
  } catch (_) {
    // no-op: if this does not work, use the other regex pattern.
  }
  return lookUpVersion;
}
