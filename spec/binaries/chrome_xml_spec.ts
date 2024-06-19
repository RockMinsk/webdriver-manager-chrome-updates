import * as path from 'path';
import * as rimraf from 'rimraf';
import {ChromeXml} from '../../lib/binaries/chrome_xml';

describe('chrome xml reader', () => {
  let out_dir = path.resolve('selenium_test');

  afterAll(() => {
    rimraf.sync(out_dir);
  });

  it('should get a list', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x64';
    chromeXml.getVersionList().then(list => {
      for (let item of list) {
        expect(item).toContain('/chromedriver-mac');
        expect(item).not.toContain('m1');
      }
      done();
    });
  });

  it('should get the 115.0.5790.170, 64-bit version (arch = x64)', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x64';
    chromeXml.getUrl('115.0.5790.170').then(binaryUrl => {
      expect(binaryUrl.url).toContain('115.0.5790.170/mac-x64/chromedriver-mac-x64.zip');
      done();
    });
  });

  it('should get the 115.0.5790.170, 64-bit version (arch = x86)', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'x86';
    chromeXml.getUrl('115.0.5790.170').then(binaryUrl => {
      expect(binaryUrl.url).toEqual('');
      done();
    });
  });

  it('should get the 115.0.5790.170, 32-bit version (arch = x64)', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Linux';
    chromeXml.osarch = 'x64';
    chromeXml.getUrl('115.0.5790.170').then(binaryUrl => {
      expect(binaryUrl.url).toContain('115.0.5790.170/linux64/chromedriver-linux64.zip');
      done();
    });
  });

  it('should get the 115.0.5790.170, 32-bit version (arch = x86)', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Windows_NT';
    chromeXml.osarch = 'x86';
    chromeXml.getUrl('115.0.5790.170').then((binaryUrl) => {
      expect(binaryUrl.url).toContain('115.0.5790.170/win32/chromedriver-win32.zip');
      done();
    });
  });

  // This test case covers a bug when all the following conditions were true.
  //  arch was 64 with multiple major versions available.
  it('should not get the 115.0.5790.170, 64-bit version (arch = x64)', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Windows_NT';
    chromeXml.osarch = 'x64';
    chromeXml.getUrl('115.0.5790.170').then((binaryUrl) => {
      expect(binaryUrl.url).toContain('115.0.5790.170/win64/chromedriver-win64.zip');
      done();
    });
  });

  it('should get the 115.0.5790.170, 64-bit, m1 version (arch = arm64)', (done) => {
    let chromeXml = new ChromeXml();
    chromeXml.out_dir = out_dir;
    chromeXml.ostype = 'Darwin';
    chromeXml.osarch = 'arm64';
    chromeXml.getUrl('115.0.5790.170').then((binaryUrl) => {
      expect(binaryUrl.url).toContain('115.0.5790.170/mac-arm64/chromedriver-mac-arm64.zip');
      done();
    });
  });
});
