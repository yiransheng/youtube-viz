# Youtube Data Visualization

> A MIDS W209 Final Project



[Demo Link](https://yiransheng.github.io/youtube-viz/index.html)



This is a placeholder of quick summary.

![](screenshot.png)

## Overview

Built with the following libraries:

- d3
- plottable.js
- React
- Redux

### Features

- Dynamic Reporting
- Configurable metrics and calculations
- Cross-filtering

## Dataset

TODO

## Python Preprocessing

See [notebook](./data/YT-DominantColor.ipynb)

It contains short python code of downloading video thumbnails, and output dataset as json file.

## Installation

Once installed dependencies (`nodejs`, `npm`), the app can be run as:

```bash
cd app
npm install
npm start
```

### Install

Requires `node` verion >=5.0.0 `npm` version >= 3.0.0. Older versions of them work fine mostly, but it's recommanded to upgrade.

Install node on mac:
```
brew install node
```

```
node -v
npm -version
```


For fresh install grab `node` here:

```
https://nodejs.org/en/
```

For upgrading `node` and `npm`, refer to this resource: [http://tecadmin.net/upgrade-nodejs-via-npm/](http://tecadmin.net/upgrade-nodejs-via-npm/). Short summary:

```
# check node version
node -v
# clean npm cache
sudo npm cache clean -f
# install upgrade util n
sudo npm install --global n
# upgrade node and npm
sudo n stable
```

Once `node` and `npm` are up-to-date, run the following to install dependencies:

```
npm install
```



### Update Dependencies

Only `npm` is used to manage dependencies, run (under the folder `yt8m`):

```
npm update
```
