# JavaScript Performance

This is a VSCode extension available at the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=MazenKhiami.jsperformance).

Run multiple JavaScript test-cases against a certain logic in VS Code and simply find out the fastest one.
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


## Requirements
It supports vanilla JavaScript at the moment.

## Installation
Click on the 'Install' button when after visiting the following link
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=MazenKhiami.jsperformance)

Note: you may have to reload the window for the extension to take effect! Run 'Reload Window' from the VSCode Command Panel

## Extension Settings

Open Extenion settings to change the (n) of times each case is executed. Default is set to 100K

## Todo/Future Updates

1. Support wider range of definition/case syntax/format
2. Support other javascript formats e.g. typescript and jsx

## Contribute

Feel free to open issues or PRs.

## Extension Logo
Attribution to the [flaticon.com](https://www.flaticon.com/premium-icon/rocket_3049618?term=rocket&page=1&position=14) for the use of the extension's logo! 

