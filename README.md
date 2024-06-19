
Webdriver Manager fork with updates for ChromeDriver version 115 and higher
=================

**Notes:**
 - this is a fork of the [Webdriver Manager](https://www.npmjs.com/package/webdriver-manager) updated to use ChromeDriver v.115 and higher.
 - only latest released versions per milestone can be used - [ChromeDriver versions](https://googlechromelabs.github.io/chrome-for-testing/latest-versions-per-milestone-with-downloads.json).

A selenium server and browser driver manager for your end to end tests. This is the same tool as `webdriver-manager` from the [Protractor](https://github.com/angular/protractor) repository.

Getting Started
---------------

```
npm install -g webdriver-manager
```

Setting up a Selenium Server
----------------------------

Prior to starting the selenium server, download the selenium server jar and driver binaries. By default it will download the selenium server jar and chromedriver binary.

```
webdriver-manager update
```

Starting the Selenium Server
----------------------------

By default, the selenium server will run on `http://localhost:4444/wd/hub`.


```
webdriver-manager start
```

Other useful commands
---------------------

View different versions of server and driver files:

```
webdriver-manager status
```

Clear out the server and driver files. If `webdriver-manager start` does not work, try to clear out the saved files.

```
webdriver-manager clean
```

Running / stopping server in background process (stopping is not yet supported on standalone server 3.x.x):

```
webdriver-manager start --detach
webdriver-manager shutdown
```

Help commands
-------------

Wedriver-manager has a main help option: `webdriver-manager help`. There are also other built in help menus for each of the commands. So for example, if you would like to look up all the flag options you can set in `update`, you could run `webdriver-manager update help`.

Here are a list of all the commands with help:

```
webdriver-manager update help
webdriver-manager start help
webdriver-manager clean help
webdriver-manager status help
```
