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
      ) as SectionNode;
      if (section) {
        let componentSets = section.findAll(
          (node: SceneNode) => node.type === "COMPONENT_SET"
        ) as ComponentSetNode[];
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
        try {
          instance.setProperties(overrides);
        } catch (error) {
          console.log("Properties not set", error);
        }
        await Promise.resolve();
        // text overrides
        for (let text of instance.findAll(n => n.type === "TEXT") as TextNode[]) {
          if (element[text.name] !== undefined) {
            text.characters = element[text.name];
          }
        }
        sizeContainer.appendChild(instance);
        instance.detachInstance();
        // set image
        if (sizeContainer.findOne(n => n.name === "PicPlate") as any) {
          let imageContainer = sizeContainer.findOne(n => n.name === "PicPlate") as any;
          let render = getImage(element.Project);
          // copy of render
          if (render) {
            let zone = render.findOne(n => n.name === "Zone") as RectangleNode;
            if (zone) {
              let containerWidth = imageContainer.width;
              let containerHeight = imageContainer.height;
              let zoneWidth = zone.width;
              let zoneHeight = zone.height;
              let scale: number;
              if (zoneWidth <= 0 || zoneHeight <= 0 || containerWidth <= 0 || containerHeight <= 0) {
                scale = 1;
              } else {
                let scaleX = containerWidth / zoneWidth;
                let scaleY = containerHeight / zoneHeight;
                scale = Math.min(scaleX, scaleY);
                // check if image is smaller than container and if so, scale it to the container size
                if ((render.width * scale < containerWidth) || (render.height * scale < containerHeight)) {
                  scale = Math.max(scaleX, scaleY);
                }
                // calculate position of render after scaling with half of zone size
                let renderCopy = render.findOne(n => n.name === "Render")?.clone();
                renderCopy?.resize(render.width * scale, render.height * scale);
                let zoneCentre = {
                  x: (zone.x + zone.width  / 2) * scale,
                  y: (zone.y + zone.height / 2) * scale,
                };
                let containerCentre = {
                  x: imageContainer.width  / 2,
                  y: imageContainer.height / 2,
                };
                renderCopy.x = containerCentre.x - zoneCentre.x;
                renderCopy.y = containerCentre.y - zoneCentre.y;
                imageContainer.appendChild(renderCopy);
              }
            }
          }
        }
      }
    }

    let template = getTemplates();
    if (template) {
      msg.file.forEach((element: any) => {
        let page = unitPage(element.Unit) as PageNode;
        createFrames(template, element, page);
      });
    }
    figma.closePlugin();
  }
};
