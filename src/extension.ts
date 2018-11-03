'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, commands, window } from 'vscode';
import  * as vscode from 'vscode';
import * as fs from 'fs';
import { DepNodeProvider } from './depNodeProvider';

const awsParamStore = require( 'aws-param-store' );
const AWS_SSM = require('aws-sdk/clients/ssm');
var ssm = new AWS_SSM({
    accessKeyId: 'XXXXX', 
    secretAccessKey: 'XXXXXXX',
    region: 'ap-southeast-1'
})

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // //if there is file, 
    workspace.findFiles('.aws-credentials').then((result) => {
        fs.readFile('.aws-credentials', function (err, data) {
            if (err) throw err;
            console.log(data);
          });

            ssm.getParametersByPath({
            Path: '/',
            MaxResults: 10,
            Recursive: true
            }, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            vscode.window.registerTreeDataProvider('nodeDependencies', new DepNodeProvider());

            });
    });
    // if (workspace.findFiles('.aws-credentials')) {
    //     window.showInformationMessage('test!');
    //     console.log('yay');
    //     commands.executeCommand('setContext', 'jsonOutlineEnabled');    
    // }
    commands.executeCommand('setContext', 'jsonOutlineEnabled', true); 

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "aws-test" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}