"use strict";
figma.showUI(__html__, { width: 980, height: 600, title: "MyTitle" });
figma.ui.onmessage = async (msg) => {
    if (msg.type === 'importCsv' && msg.content) {
        const frameSizes = ['1920x1080', '1080x1920', '1080x1080', '1080x1350'];
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        await figma.loadFontAsync({ family: "CoFo Sans", style: "Medium" });
        await figma.loadFontAsync({ family: "Bebas Neue", style: "Book" });
        await figma.loadFontAsync({ family: "CoFo Sans", style: "Regular" });
        await figma.loadFontAsync({ family: "Bebas Neue", style: "Regular" })
        const headers = ['Title', 'Message1', 'Message2', 'Message3', 'Legal'];
        const fields = msg.content.split(/;\s*|\r\n/);
        const findFrame = (size) => {
            const frame = figma.currentPage.findOne(node => node.type === 'FRAME' && node.name === size);
            return frame;
        };
        let replaceImageBackground = (frameCopy) => {
            let picPlateNode = frameCopy.findOne(node => node.name === 'PicPlate');
            if (picPlateNode) {
                let frameCopyTitle = frameCopy.name;
                console.log(frameCopyTitle);
                let defaultImage;
                if (frameCopyTitle == "Target_1080x1350_Typo1") {
                    defaultImage = findFrame('DefaultHorizontal');
                }
                else {
                    defaultImage = findFrame('Default');
                }
                // Check if the image exists and has fills
                if (defaultImage && defaultImage.fills && defaultImage.fills[0]) {
                    // Create a new paint style for the image
                    if (defaultImage.fills[0].imageHash) {
                        let imagePaint = {
                            type: 'IMAGE',
                            scaleMode: 'FILL',
                            imageHash: defaultImage.fills[0].imageHash
                        };
                        if (frameCopyTitle == "Target_1080x1350_Typo1") {
                            imagePaint.scaleMode = 'FIT';
                        }
                        picPlateNode.fills = [
                            { type: 'SOLID', color: { r: 0.1019607843, g: 0.5411764706, b: 1 } }, imagePaint
                        ];
                    }
                    else {
                        console.log('No imageHash found in the first fill of the "Default" frame.');
                        console.log('defaultImage.fills[0]:', defaultImage.fills[0]); // Add this line
                    }
                }
                else {
                    console.log('No image found in the "Default" frame.');
                }
            }
            else {
                console.log('Could not find "PicPlate" node or "Default" frame.');
            }
        };
        // A function which unites all build functions
        let buildFrames = (x, message1, message2, message3, legal, parent) => {
            build1920x1080Frame(x, message1, message2, message3, legal, parent);
            build1080x1920Frame(x, message1, message2, message3, legal, parent);
            build1080x1080Frame(x, message1, message2, message3, legal, parent);
            build1080x1350Frame(x, message1, message2, message3, legal, parent);
        };
        let buildContextFrames = (x, message1, message2, message3, legal, parent) => {
            build300x250Frame(x, message1, message2, message3, legal, parent);
            build300x600Frame(x, message1, message2, message3, legal, parent);
            build728x90Frame(x, message1, message2, message3, legal, parent);
            build240x400Frame(x, message1, message2, message3, legal, parent);
        };
        let build300x250Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Context_300x250_SmallTypo');
            let picFrame = findFrame('Context_300x250_Pic');
            let lastFrame = findFrame('Context_300x250_Legal');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var picCopy = picFrame.clone();
                    var lastFrameCopy = lastFrame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = lastFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    replaceImageBackground(picCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(picCopy);
                    AutolayoutForThisSize.appendChild(lastFrameCopy);
                    AutolayoutForThisSize.name = "300x250";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var picCopy = picFrame.clone();
                    var lastFrameCopy = lastFrame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var textNode2 = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = lastFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    textNode2.characters = message2;
                    legalNode.characters = legal;
                    replaceImageBackground(picCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(picCopy);
                    AutolayoutForThisSize.appendChild(lastFrameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    console.log("TEST");
                    console.log("TEST");
                    console.log("TEST");
                    console.log("TEST");
                    break;
            }
        };
        let build300x600Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Context_300x600');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var legalNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    replaceImageBackground(frameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var secondTextNode = secondFrameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var legalNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    var secondLegalNode = secondFrameCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    secondTextNode.characters = message2;
                    secondLegalNode.characters = legal;
                    if (textNode.height > secondTextNode.height) {
                        secondTextNode.resize(textNode.width, textNode.height);
                    }
                    else {
                        textNode.resize(secondTextNode.width, secondTextNode.height);
                    }
                    replaceImageBackground(frameCopy);
                    replaceImageBackground(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    break;
            }
        };
        let build728x90Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'VERTICAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Context_728x90');
            let lastFrame = findFrame('Context_728x90_Legal');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var legalCopy = lastFrame.clone();
                    var legalNode = legalCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    replaceImageBackground(frameCopy);
                    replaceImageBackground(legalCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(legalCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var legalCopy = lastFrame.clone();
                    var textNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var textNode2 = secondFrameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var legalNode = legalCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    textNode.characters = message1;
                    textNode2.characters = message2;
                    legalNode.characters = legal;
                    replaceImageBackground(frameCopy);
                    replaceImageBackground(secondFrameCopy);
                    replaceImageBackground(legalCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(legalCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    break;
            }
        };
        let build240x400Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Context_240x400');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var legalNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    replaceImageBackground(frameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var secondTextNode = secondFrameCopy.findOne(node => node.type === "TEXT" && node.name === "MessageText");
                    var legalNode = frameCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    var secondLegalNode = secondFrameCopy.findOne(node => node.type === "TEXT" && node.name === "LegalText");
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    secondTextNode.characters = message2;
                    secondLegalNode.characters = legal;
                    if (textNode.height > secondTextNode.height) {
                        secondTextNode.resize(textNode.width, textNode.height);
                    }
                    else {
                        textNode.resize(secondTextNode.width, secondTextNode.height);
                    }
                    replaceImageBackground(frameCopy);
                    replaceImageBackground(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    break;
            }
        };
        let build1920x1080Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Target_1920x1080_Typo1');
            let secondFrame = findFrame('Target_1920x1080_Typo2');
            let lastFrame = findFrame('Target_1920x1080_Pic');
            switch (x) {
                case '1':
                    var secondFrameCopy = secondFrame.clone();
                    var lastFrameCopy = lastFrame.clone();
                    replaceImageBackground(secondFrameCopy);
                    replaceImageBackground(lastFrameCopy);
                    var textNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var textNode2 = lastFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    var legalNode2 = lastFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    textNode2.characters = message1;
                    legalNode.characters = legal;
                    legalNode2.characters = legal;
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(lastFrameCopy);
                    AutolayoutForThisSize.name = "1920x1080";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = secondFrame.clone();
                    var lastFrameCopy = lastFrame.clone();
                    replaceImageBackground(secondFrameCopy);
                    replaceImageBackground(lastFrameCopy);
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var textNode2 = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText2');
                    var secondTextNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var lastTextNode = lastFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    var legalNode2 = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText2');
                    var secondLegalNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    var lastLegalNode = lastFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    textNode2.characters = message2;
                    secondTextNode.characters = message2;
                    lastTextNode.characters = message2;
                    legalNode.characters = legal;
                    legalNode2.characters = legal;
                    secondLegalNode.characters = legal;
                    lastLegalNode.characters = legal;
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(lastFrameCopy);
                    AutolayoutForThisSize.name = "1920x1080";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    console.log("!!!");
                    console.log(x);
                    console.log("!!!");
                    break;
            }
        };
        let build1080x1920Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Target_1080x1920_Typo1');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    replaceImageBackground(frameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.name = "1080x1920";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    var secondTextNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var secondLegalNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    secondTextNode.characters = message2;
                    secondLegalNode.characters = legal;
                    if (textNode.height > secondTextNode.height) {
                        secondTextNode.resize(textNode.width, textNode.height);
                    }
                    else {
                        textNode.resize(secondTextNode.width, secondTextNode.height);
                    }
                    replaceImageBackground(frameCopy);
                    replaceImageBackground(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.name = "1080x1920";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    console.log("!!!");
                    console.log(x);
                    console.log("!!!");
                    break;
            }
        };
        let build1080x1080Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Target_1080x1080_Typo1');
            let lastFrame = findFrame('Target_1080x1080_Pic');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var lastFrameCopy = lastFrame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(lastFrameCopy);
                    AutolayoutForThisSize.name = "1080x1080";
                    replaceImageBackground(lastFrameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var lastFrameCopy = lastFrame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    var secondTextNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var secondLegalNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    secondTextNode.characters = message2;
                    secondLegalNode.characters = legal;
                    replaceImageBackground(lastFrameCopy);
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.appendChild(lastFrameCopy);
                    AutolayoutForThisSize.name = "1080x1080";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    console.log("!!!");
                    console.log(x);
                    console.log("!!!");
                    break;
            }
        };
        let build1080x1350Frame = (x, message1, message2, message3, legal, parent) => {
            message1 = message1.slice(1, -1);
            message2 = message2.slice(1, -1);
            message3 = message3.slice(1, -1);
            let AutolayoutForThisSize = figma.createFrame();
            AutolayoutForThisSize.layoutMode = 'HORIZONTAL';
            AutolayoutForThisSize.counterAxisSizingMode = 'AUTO';
            AutolayoutForThisSize.primaryAxisAlignItems = 'MIN';
            AutolayoutForThisSize.itemSpacing = 80;
            AutolayoutForThisSize.fills = [];
            let frame = findFrame('Target_1080x1350_Typo1');
            switch (x) {
                case '1':
                    var frameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.name = "1080x1350";
                    replaceImageBackground(frameCopy);
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '2':
                    var frameCopy = frame.clone();
                    var secondFrameCopy = frame.clone();
                    var textNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var legalNode = frameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    var secondTextNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'MessageText');
                    var secondLegalNode = secondFrameCopy.findOne(node => node.type === 'TEXT' && node.name === 'LegalText');
                    textNode.characters = message1;
                    legalNode.characters = legal;
                    secondTextNode.characters = message2;
                    secondLegalNode.characters = legal;
                    replaceImageBackground(frameCopy);
                    replaceImageBackground(secondFrameCopy);
                    //get textNode height. If it is bigger than secondTextNode then set secondTextNode heigth to the height of textNode. If secondTextNode is higher than textNode then set textNode to the same height as of the secondTextNode
                    if (textNode.height > secondTextNode.height) {
                        secondTextNode.resize(textNode.width, textNode.height);
                    }
                    else {
                        textNode.resize(secondTextNode.width, secondTextNode.height);
                    }
                    AutolayoutForThisSize.appendChild(frameCopy);
                    AutolayoutForThisSize.appendChild(secondFrameCopy);
                    AutolayoutForThisSize.name = "1080x1350";
                    parent.appendChild(AutolayoutForThisSize);
                    break;
                case '3':
                    console.log("!!!");
                    console.log(x);
                    console.log("!!!");
                    break;
            }
        };
        const calculateAmount = (size, message1, message2, message3) => {
            let count = 0;
            if (message1 !== 'Nil') {
                count++;
            }
            if (message2 !== 'Nil') {
                count++;
            }
            if (message3 !== 'Nil') {
                count++;
            }
            switch (size) {
                case '1920x1080':
                    if (count === 1) {
                        return 1;
                    }
                    else if (count === 2) {
                        return 2;
                    }
                    else if (count === 3) {
                        return 3;
                    }
                    break;
                case '1080x1920':
                    if (count === 1) {
                        return 1;
                    }
                    else if (count === 2) {
                        return 2;
                    }
                    else if (count === 3) {
                        return 3;
                    }
                    break;
                case '1080x1080':
                    if (count === 1) {
                        return 1;
                    }
                    else if (count === 2) {
                        return 2;
                    }
                    else if (count === 3) {
                        return 3;
                    }
                    break;
                case '1080x1350':
                    if (count === 1) {
                        return 1;
                    }
                    else if (count === 2) {
                        return 2;
                    }
                    else if (count === 3) {
                        return 3;
                    }
                    break;
            }
        };
        let i = 0;
        let allData = []; // Explicitly declare the type of 'allData' as an array of dictionaries
        let dictionary = {}; // Declare the dictionary variable outside of the forEach loop
        fields.forEach(field => {
            if (i < 4) { // Add parentheses around the condition
                dictionary[headers[i]] = field;
                i++;
            }
            else if (i === 4) {
                dictionary[headers[i]] = field;
                allData.push(dictionary);
                dictionary = {}; // Clear the dictionary after adding it to allData
                i = 0;
            }
        });
        // console.log(allData)
        let allCompanies = figma.createFrame();
        allCompanies.layoutMode = "VERTICAL";
        allCompanies.counterAxisSizingMode = 'AUTO'; // Set the counter axis sizing mode to auto
        allCompanies.primaryAxisAlignItems = 'MIN'; // Set the primary axis alignment to min
        allCompanies.itemSpacing = 500;
        allCompanies.fills = [];
        allData.forEach(async (data) => {
            let message1 = data['Message1'];
            let message2 = data['Message2'];
            let message3 = data['Message3'];
            let legal = data['Legal'];
            // calculate the number of frames required of each size
            let allFramesRequired = [];
            frameSizes.forEach(size => {
                let framesRequiredForOneSize = calculateAmount(size, message1, message2, message3);
                allFramesRequired.push({ size: size, amount: framesRequiredForOneSize.toString() });
            });
            let targetAndContext = figma.createFrame();
            targetAndContext.layoutMode = "HORIZONTAL";
            targetAndContext.counterAxisSizingMode = 'AUTO'; // Set the counter axis sizing mode to auto
            targetAndContext.primaryAxisAlignItems = 'MIN'; // Set the primary axis alignment to min
            targetAndContext.itemSpacing = 500;
            targetAndContext.fills = [];
            const autoLayout = figma.createFrame(); // Create an autolayout frame
            autoLayout.layoutMode = 'VERTICAL'; // Set the layout mode to VERTICAL
            autoLayout.counterAxisSizingMode = 'AUTO'; // Set the counter axis sizing mode to auto
            autoLayout.primaryAxisAlignItems = 'MIN'; // Set the primary axis alignment to min
            autoLayout.itemSpacing = 120;
            // autoLayout.fills = [];
            //make the autolayout background color #404040
            autoLayout.fills = [{ type: 'SOLID', color: { r: 0.25, g: 0.25, b: 0.25 } }];
            // add paddings to this autolayout
            autoLayout.paddingTop = 400;
            autoLayout.paddingRight = 400;
            autoLayout.paddingBottom = 400;
            autoLayout.paddingLeft = 400;
            figma.currentPage.appendChild(autoLayout);
            buildFrames(allFramesRequired[0]['amount'], message1, message2, message3, legal, autoLayout);
            autoLayout.resize(6720, autoLayout.height);
            autoLayout.name = `${data['Title']} Target`;
            const contextLayout = figma.createFrame(); // Create an autolayout frame
            contextLayout.layoutMode = 'VERTICAL'; // Set the layout mode to VERTICAL
            contextLayout.counterAxisSizingMode = 'AUTO'; // Set the counter axis sizing mode to auto
            contextLayout.primaryAxisAlignItems = 'MIN'; // Set the primary axis alignment to min
            contextLayout.itemSpacing = 120;
            contextLayout.fills = [{ type: 'SOLID', color: { r: 0.25, g: 0.25, b: 0.25 } }];
            //set width of contextLayout to 3000pixels
            contextLayout.paddingTop = 400;
            contextLayout.paddingRight = 400;
            contextLayout.paddingBottom = 400;
            contextLayout.paddingLeft = 400;
            contextLayout.resize(2200, contextLayout.height);
            contextLayout.name = `${data['Title']} Context`;
            buildContextFrames(allFramesRequired[0]['amount'], message1, message2, message3, legal, contextLayout);
            targetAndContext.appendChild(contextLayout);
            targetAndContext.appendChild(autoLayout);
            allCompanies.appendChild(targetAndContext);
        });
    }
    figma.closePlugin();
};
