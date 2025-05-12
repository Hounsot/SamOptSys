// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = async (msg: {type: string, file: any}) => {
  if (msg.type === 'importCsv') {
    // console.log("Importing CSV file:", msg.file);
    // Load the font
    await figma.loadFontAsync({ family: "Suisse Intl", style: "Regular" });
    
    // Example usage (you might call this elsewhere based on your logic)
    await figma.loadAllPagesAsync();
    function getTemplates() {
      // we find section and then all the component sets in it
      let section = figma.currentPage.findOne(node => node.type === "SECTION" && node.name === "Template");
      if (section) {
        const componentSets = section.findAll(node => node.type === "COMPONENT_SET");
        return componentSets;
      }
      return null;
    }
    function unitPage(name: string) {
      let page = figma.root.findOne(node => node.name === name);
      if (page) {
        return page;
      }
      let newPage = figma.createPage();
      newPage.name = name;
      let projectsFrame = figma.createFrame();
      projectsFrame.name = "Projects";
      projectsFrame.layoutMode = "HORIZONTAL";
      projectsFrame.itemSpacing = 48;
      projectsFrame.paddingTop = 48;
      projectsFrame.paddingBottom = 48;
      projectsFrame.paddingLeft = 48;
      projectsFrame.primaryAxisSizingMode = "AUTO";
      projectsFrame.counterAxisSizingMode = "AUTO";
      projectsFrame.paddingRight = 48;
      newPage.appendChild(projectsFrame);
      return newPage;
    }
    function createFrames(componentSets: ComponentSetNode[], element: any, page: PageNode) {
      // find all text layer names inside componentSets
      let meta = {
        "Unit": element.Unit,
        "Project": element.Project,
        "Channel": element.Channel,
        "Id": element.Id
      }
      let properties = {
        "Class": element.Class,
        "ДомРФ": element.Condition1
      }
      let tableContent = element
      let autoLayoutFrame = figma.createFrame();
      autoLayoutFrame.name = meta.Project + ", " + meta.Id;
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
      let projectsFrame = page.findOne(node => node.name === "Projects") as FrameNode;
      projectsFrame.appendChild(autoLayoutFrame);
      componentSets.forEach(set => {
        let sizeContainer = figma.createFrame();
        sizeContainer.name = "SizeContainer";
        sizeContainer.layoutMode = "HORIZONTAL";
        sizeContainer.itemSpacing = 24;
        sizeContainer.primaryAxisSizingMode = "AUTO";
        sizeContainer.counterAxisSizingMode = "AUTO";
        sizeContainer.fills = [];
        autoLayoutFrame.appendChild(sizeContainer);
        let variant = set.defaultVariant;
        let instance = variant.createInstance();
        sizeContainer.appendChild(instance);
        let textLayers = instance.findAll(node => node.type === "TEXT");
        textLayers.forEach(e => {
          if (e.name in tableContent) {
            let textToChange = instance.findOne(node => node.name === e.name) as TextNode;
            textToChange.characters = tableContent[e.name]
          } else {
            console.log("No table content for", e.name)
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
      let page = unitPage(element.Unit);
      createFrames(template, element, page);
    });
    figma.closePlugin();
  };
}