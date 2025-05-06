// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = async (msg: {type: string, file: any}) => {
  if (msg.type === 'importCsv') {
    // console.log("Importing CSV file:", msg.file);
    // Load the font
    await figma.loadFontAsync({ family: "Suisse Intl", style: "Regular" });
    
    // Example usage (you might call this elsewhere based on your logic)
    // await figma.loadAllPagesAsync();
    function getTemplates() {
      // we find section and then all the component sets in it
      let section = figma.currentPage.findOne(node => node.type === "SECTION" && node.name === "Template");
      if (section) {
        const componentSets = section.findAll(node => node.type === "COMPONENT_SET");
        return componentSets;
      }
      return null;
    }
    function createFrames(componentSets: ComponentSetNode[], properties: any, texts: any, meta: any) {
      let autoLayoutFrame = figma.createFrame();
      autoLayoutFrame.name = meta.Unit + ", " + meta.Project + ", " + meta.Channel;
      autoLayoutFrame.layoutMode = "VERTICAL";
      autoLayoutFrame.itemSpacing = 24;
      autoLayoutFrame.paddingTop = 48;
      autoLayoutFrame.paddingBottom = 48;
      autoLayoutFrame.paddingLeft = 48;
      autoLayoutFrame.paddingRight = 48;
      autoLayoutFrame.primaryAxisSizingMode = "AUTO";
      autoLayoutFrame.counterAxisSizingMode = "AUTO";
      autoLayoutFrame.fills = [{
        type: "SOLID",
        color: {r: 0.25, g: 0.25, b: 0.25}
      }];
      figma.currentPage.appendChild(autoLayoutFrame);
      componentSets.forEach(element => {
        let sizeContainer = figma.createFrame();
        sizeContainer.name = "SizeContainer";
        sizeContainer.layoutMode = "HORIZONTAL";
        sizeContainer.itemSpacing = 24;
        sizeContainer.primaryAxisSizingMode = "AUTO";
        sizeContainer.counterAxisSizingMode = "AUTO";
        // remove all fills
        sizeContainer.fills = [];
        autoLayoutFrame.appendChild(sizeContainer);
        texts.Messages.forEach((message: string) => {
          if (message != "") {
          let variant = element.defaultVariant;
          let instance = variant.createInstance();
          sizeContainer.appendChild(instance);

          try {
            instance.setProperties(properties);
          } catch (error) {
            const defaultVariant = element.defaultVariant;
            if (defaultVariant) {
              instance.remove(); // Remove the failed instance
              instance = defaultVariant.createInstance(); // Create new instance from default
              sizeContainer.appendChild(instance);
            }
          }

          let messageText = instance.findOne(node => node.name === "MessageText") as TextNode;
          let descriptionText = instance.findOne(node => node.name === "LegalText") as TextNode;
          messageText.characters = message;
          descriptionText.characters = texts.Description;
          }
        });  
        let tallestMessage = 0;
        sizeContainer.findAll(node => node.name === "MessageText").forEach(messageText => {
          let messageHeight = messageText.height;
          if (messageHeight > tallestMessage) {
            tallestMessage = messageHeight;
          } 
        });
        sizeContainer.findAll(node => node.name === "MessageText").forEach(node => {
          let textNode = node as TextNode;
          if (textNode.height < tallestMessage) {
            let text = textNode.characters;
            textNode.characters = text + "\n";
            if (textNode.height < tallestMessage) {
              text = textNode.characters;
              textNode.characters = text + "\n";
            }  
          }
        });
      });
    }

    let template = getTemplates()
    
    msg.file.forEach((element: any) => {
      console.log(element)
      let meta = {
        "Unit": element.Unit,
        "Project": element.Project,
        "Channel": element.Channel
      }
      let properties = {
        "Class": element.Class,
        "ДомРФ": element.Condition1
      }
      let messages = [element.Message1, element.Message2, element.Message3]
      let texts = {
        "Messages": messages,
        "Description": element.Description
      }
      createFrames(template, properties, texts, meta);
    });
    figma.closePlugin();
  };
}