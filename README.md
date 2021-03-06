<p align="left">
  <img src="https://raw.githubusercontent.com/khiami/js-performance/master/images/extension-icon.png" width="150">
</p>


# JavaScript Performance

This is a VSCode extension available at the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=MazenKhiami.jsperformance).

[![Badge for version for Visual Studio Code extension khiami.js-performance](https://vsmarketplacebadge.apphb.com/version/khiami.js-performance.svg?color=blue&style=?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=MazenKhiami.jsperformance) [![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?color=blue&style=flat-square)](http://opensource.org/licenses/MIT)

This is an extension to easily create JavaScript performance benchmark when highlighting your script.
The result will appear in the status bar where the case name will be used. The extension may notify if the highlighted snippet didn't run successfully.

Make sure to include all functions/variables/arrays etc.. related to the highlighted definition/case in the selected range, so that the extension can run each case separately.

## Features

You can create a definition and multiple cases. Once selected, they will be auto-included in the benchmark. It will auto-refresh when you change the selection range. 

Comply with the format below to run the benchmark successfully:

```javascript
// definition 
const arrayValues = [ 11, 33, 44, 55, 44, 55, 102, 1033, 44 ]

// case <case-name>
const uniqueApproach2 = '...'

// case <case-name>
const uniqueApproach2 = '...'

```

Working example

```javascript
// definition
const sample = `Lorem Ipsum is simply dummy text of 
  the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown 

  printer took a galley of type
  and scrambled it to make a type specimen book.
  It has survived not only five centuries, but also the leap into 
  electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`

// case Simple Split
const result = sample?.split( '\n' ).length

// case For/loop with charAt
let counter2 = 0;
for ( let i = 0; i < sample.length; i++)
  sample.charAt(i) === '\n' && counter2++
  ```


![alt Working example](https://raw.githubusercontent.com/khiami/js-performance/master/images/jsperformance-vscode-extension.gif)


## Installation

1. Open **Extensions** sideBar panel in Visual Studio Code and choose the menu options for **View ??? Extensions**
1. Search for `jsperformance`
1. Click **Install**
1. Click **Reload**, if required


## Requirements
It supports vanilla JavaScript at the moment.

## Extension Settings

Open Extenion settings to change the (n) of times each case is executed. Default is set to 100K

## Extension Updates
0.0.14 The extension reports the error as a side notification, when applicable.
0.0.13 You can set the execution times at the definition level, e.g.

```javascript
// definition, run 90000 times 
const arrayValues = [ 11, 33, 44, 55, 44, 55, 102, 1033, 44 ]

..
..

```

## Todo/Future Updates

1. Support wider range of definition/case syntax/format
2. Support other javascript formats e.g. typescript and jsx

## Contribute

Feel free to open issues or PRs.

## Extension Logo
Attribution to the [flaticon.com](https://www.flaticon.com/premium-icon/rocket_3049618?term=rocket&page=1&position=14) for the use of the extension's logo! 

