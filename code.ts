// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = async (msg: { type: string; file: any }) => {
  if (msg.type === "importCsv") {
    // console.log("Importing CSV file:", msg.file);
    // Load the font
    await figma.loadFontAsync({ family: "Suisse Intl", style: "Regular" });

    // Example usage (you might call this elsewhere based on your logic)
    await figma.loadAllPagesAsync();
    function getTemplates() {
      // we find section and then all the component sets in it
      let section = figma.currentPage.findOne(
        (node) => node.type === "SECTION" && node.name === "Template"
      );
      if (section) {
        const componentSets = section.findAll(
          (node) => node.type === "COMPONENT_SET"
        );
        return componentSets;
      }
      return null;
    }
    function unitPage(name: string) {
      let page = figma.root.findOne((node) => node.name === name);
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
    function getImage(name: string) {
      let imageSection = figma.currentPage.findOne(
        (node) => node.name === "Images"
      ) as SectionNode;
      if (imageSection) {
        // find group with this title
        let image = imageSection.findOne(
          (node) => node.name === name
        ) as GroupNode;
        if (image) {
          return image;
        }
      }
      return null;
    }
    async function createFrames(
      componentSets: ComponentSetNode[],
      element: any,
      page: PageNode
    ) {
      // find all text layer names inside componentSets
      let meta = {
        Unit: element.Unit,
        Project: element.Project,
        Channel: element.Channel,
        Id: element.Id,
      };
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
      autoLayoutFrame.fills = [
        {
          type: "SOLID",
          color: { r: 0.25, g: 0.25, b: 0.25 },
        },
      ];
      let projectsFrame = page.findOne(
        (node) => node.name === "Projects"
      ) as FrameNode;
      projectsFrame.appendChild(autoLayoutFrame);
      for (let set of componentSets) {
        let sizeContainer = figma.createFrame();
        sizeContainer.name = "SizeContainer";
        sizeContainer.layoutMode = "HORIZONTAL";
        sizeContainer.itemSpacing = 24;
        sizeContainer.primaryAxisSizingMode = "AUTO";
        sizeContainer.counterAxisSizingMode = "AUTO";
        sizeContainer.fills = [];
        autoLayoutFrame.appendChild(sizeContainer);
        let instance = set.defaultVariant.createInstance();
        // set properties
        let overrides: Record<string, string> = {};
        for (let prop in instance.componentProperties) {
          if (element[prop] !== undefined) {
            overrides[prop] = element[prop];
          }
        }
        instance.setProperties(overrides);
        await Promise.resolve();
        // text overrides
        for (const text of instance.findAll(n => n.type === "TEXT") as TextNode[]) {
          if (element[text.name] !== undefined) {
            text.characters = element[text.name];
          }
        }
        sizeContainer.appendChild(instance);
        // set image
        let imageContainer = instance.findOne(n => n.name === "PicPlate") as FrameNode;
        if (imageContainer) {
          let render = getImage(element.Project);
          if (render) {
            let zone = render.findOne(n => n.name === "Zone") as RectangleNode;
            if (zone) {
              let zoneHeight = zone.height;
              let zoneWidth = zone.width;
              imageContainer.resize(zoneWidth, zoneHeight);
            }
          }
        }
      }
      // componentSets.forEach((set) => {
      //   let sizeContainer = figma.createFrame();
      //   sizeContainer.name = "SizeContainer";
      //   sizeContainer.layoutMode = "HORIZONTAL";
      //   sizeContainer.itemSpacing = 24;
      //   sizeContainer.primaryAxisSizingMode = "AUTO";
      //   sizeContainer.counterAxisSizingMode = "AUTO";
      //   sizeContainer.fills = [];
      //   autoLayoutFrame.appendChild(sizeContainer);
      //   let variant = set.defaultVariant;
      //   let instance = variant.createInstance();
      //   // Тут мы получаем списком все проперти без их значений
      //   let propertyNames = Object.keys(instance.componentProperties);
      //   // Тут мы присваиваем значения проперти
      //   propertyNames.forEach((name) => {
      //     try {
      //       instance.setProperties({ [name]: tableContent[name] });
      //     } catch (e) {
      //       console.warn(
      //         `Could not set property "${name}" to "${tableContent[name]}". Falling back to default variant for this property. Error: ${e}`
      //       );
      //       // Instance already defaults to defaultVariant, so no explicit action needed here.
      //     }
      //   });
      //   sizeContainer.appendChild(instance);
      //   let textLayers = instance.findAll((node) => node.type === "TEXT");
      //   // Тут мы присваиваем значения текстам
      //   textLayers.forEach((e) => {
      //     if (e.name in tableContent) {
      //       let textToChange = instance.findOne(
      //         (node) => node.name === e.name
      //       ) as TextNode;
      //       textToChange.characters = tableContent[e.name];
      //     } else {
      //       console.log("No table content for", e.name);
      //     }
      //   });
      //   let tallestMessage = 0;
      //   sizeContainer
      //     .findAll((node) => node.name === "MessageText")
      //     .forEach((messageText) => {
      //       let messageHeight = messageText.height;
      //       if (messageHeight > tallestMessage) {
      //         tallestMessage = messageHeight;
      //       }
      //     });
      //   sizeContainer
      //     .findAll((node) => node.name === "MessageText")
      //     .forEach((node) => {
      //       let textNode = node as TextNode;
      //       if (textNode.height < tallestMessage) {
      //         let text = textNode.characters;
      //         textNode.characters = text + "\n";
      //         if (textNode.height < tallestMessage) {
      //           text = textNode.characters;
      //           textNode.characters = text + "\n";
      //         }
      //       }
      //     });
      //   // calculate image container and image
      //   let imageContainer = instance.findOne(
      //     (node) => node.name === "PicPlate"
      //   ) as FrameNode;
      //   if (imageContainer) {
      //     // get height and width of imageContainer
      //     let imageContainerHeight = imageContainer.height;
      //     let imageContainerWidth = imageContainer.width;
      //     let render = getImage(tableContent.project);
      //     // inside render find square named "Zone" and get it's size
      //     let zone = render.findOne(
      //       (node) => node.name === "Zone"
      //     ) as RectangleNode;
      //     if (zone) {
      //       let zoneHeight = zone.height;
      //       let zoneWidth = zone.width;
      //       console.log(render?.name, zoneHeight, zoneWidth);
      //     }
      //   }
      // });
    }

    let template = getTemplates();
    msg.file.forEach((element: any) => {
      console.log(element);
      let page = unitPage(element.Unit);
      createFrames(template, element, page);
    });
    figma.closePlugin();
  }
};
