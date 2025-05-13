// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = async (msg: { type: string; file: any }) => {
  if (msg.type === "importCsv") {
    // Загружаем шрифты
    await figma.loadFontAsync({ family: "Suisse Intl", style: "Regular" });
    await figma.loadFontAsync({ family: "Suisse Intl", style: "SemiBold" });

    // Загружаем все страницы
    await figma.loadAllPagesAsync();
    function getTemplates() {
      // Находим секцию и все компоненты в ней
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
    // Находим или создаем страницу по имени
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
    // Находим изображение по имени
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

    // if element with this id already exist 
    function projectExist(id: string) {
      let element = figma.root.findOne((node) => node.name.includes(id));
      if (element) {
        return true;
      }
      return false;
    }
    // Создаем фреймы для каждого проекта
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
        for (let textNode of instance.findAll(n => n.type === "TEXT") as TextNode[]) {
          if (element[textNode.name] !== undefined) {
            let rawValue = element[textNode.name];

            if (typeof rawValue === 'string' && rawValue.includes('**')) {
              let parts = rawValue.split('**');

              let isNextSegmentBold: boolean;
              if (rawValue.startsWith('**')) {
                isNextSegmentBold = true;
              } else {
                isNextSegmentBold = false;
              }

              for (let i = 0; i < parts.length; i++) {
                const segmentText = parts[i];

                if (i === 0 && rawValue.startsWith('**') && segmentText === "") {
                  // This is the empty part at the beginning from "**something"
                  // The next actual text segment will be bold. isNextSegmentBold is already true.
                  continue;
                }
                
                if (segmentText.length > 0) {
                  const start = textNode.characters.length;
                  // Using insertCharacters might be slightly safer if textNode can have existing content
                  // but since we clear it, appending to textNode.characters and then styling would also work.
                  textNode.insertCharacters(start, segmentText, "AFTER");
                  
                  const styleToApply = isNextSegmentBold ? "SemiBold" : "Regular";
                  // Need to await this, as setRangeFontName is async
                  await textNode.setRangeFontName(start, start + segmentText.length, { family: "Suisse Intl", style: styleToApply });
                }
                
                // Toggle for the NEXT segment, unless it's an empty segment from "**" at the end of rawValue
                if (!(i === parts.length - 1 && rawValue.endsWith('**') && segmentText === "")) {
                  isNextSegmentBold = !isNextSegmentBold;
                }
              }
            } else if (typeof rawValue === 'string') {
              textNode.characters = rawValue;
              // Optionally, ensure the whole text is set to Regular if no markdown is present
              if (rawValue.length > 0) {
                await textNode.setRangeFontName(0, rawValue.length, { family: "Suisse Intl", style: "Regular" });
              }
            } else {
              // Handle non-string values if necessary, e.g. numbers
              textNode.characters = String(rawValue);
              if (textNode.characters.length > 0) {
                 await textNode.setRangeFontName(0, textNode.characters.length, { family: "Suisse Intl", style: "Regular" });
              }
            }
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
                // if ((render.width * scale < containerWidth) || (render.height * scale < containerHeight)) {
                //   scale = Math.max(scaleX, scaleY);
                // }
                function willCover(scale: number) {
                  const zoneCX = (zone.x + zone.width  / 2) * scale;
                  const zoneCY = (zone.y + zone.height / 2) * scale;
                
                  // Where the image’s top-left corner will land after centring
                  const imgX = containerWidth  / 2 - zoneCX;
                  const imgY = containerHeight / 2 - zoneCY;
                
                  // Image bounds in container space
                  const imgRight  = imgX + render.width  * scale;
                  const imgBottom = imgY + render.height * scale;
                
                  return (
                    imgX       <= 0 &&          // left edge inside
                    imgY       <= 0 &&          // top  edge inside
                    imgRight   >= containerWidth &&
                    imgBottom  >= containerHeight
                  );
                }
                if (!willCover(scale)) {
                  scale = Math.max(scaleX, scaleY);   // use the larger scale
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
        if (projectExist(element.Id)) {
          console.log('EXIST', element.Id)
        }
        let page = unitPage(element.Unit) as PageNode;
        createFrames(template, element, page);
      });
    }
    figma.closePlugin();
  }
};
