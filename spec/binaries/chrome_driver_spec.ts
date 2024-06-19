import * as path from 'path';
import * as rimraf from 'rimraf';
import {ChromeDriver} from '../../lib/binaries';

describe('chrome driver', () => {
  let out_dir = path.resolve('selenium_test');

  afterAll(() => {
    rimraf.sync(out_dir);
  });

  it('should get the id', () => {
    expect(new ChromeDriver().id()).toEqual('chrome');
  });

  it('should get the url', (done) => {
    let chromeDriver = new ChromeDriver();
    chromeDriver.configSource.out_dir = out_dir;
    chromeDriver.configSource.osarch = 'x64';
    chromeDriver.configSource.ostype = 'Darwin';
    chromeDriver.getUrl('115.0.5790.170').then(binaryUrl => {
      expect(binaryUrl.url).toContain('115.0.5790.170/mac-x64/chromedriver-mac-x64.zip');
      done();
    });
  });

  it('should get the lists', (done) => {
    let chromeDriver = new ChromeDriver();
    chromeDriver.configSource.out_dir = out_dir;
    chromeDriver.configSource.osarch = 'x64';
    chromeDriver.configSource.ostype = 'Darwin';
    chromeDriver.getVersionList().then(list => {
      for (let item of list) {
        expect(item).toContain('chromedriver-mac');
      }
      done();
    });
  });
});
