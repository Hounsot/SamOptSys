// This shows the HTML page in "ui.html".
figma.showUI(__html__);

figma.ui.onmessage = async (msg: { type: string; file: any }) => {
  if (msg.type === "importCsv") {
    // Загружаем шрифты
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

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
      projectsFrame.layoutMode = "VERTICAL";
      projectsFrame.itemSpacing = 960;
      projectsFrame.primaryAxisSizingMode = "AUTO";
      projectsFrame.counterAxisSizingMode = "AUTO";
      projectsFrame.fills = [];
      newPage.appendChild(projectsFrame);
      return newPage;
    }
    function projectLayout(name: string, parent: SceneNode) {
      let project = parent.findOne((node) => node.name === name);
      if (project) {
        (project as unknown as FrameNode).fills = [];
        return project;
      }
      let newProject = figma.createFrame();
      newProject.name = name;
      newProject.layoutMode = "HORIZONTAL";
      newProject.itemSpacing = 96;
      newProject.primaryAxisSizingMode = "AUTO";
      newProject.counterAxisSizingMode = "AUTO";
      newProject.fills = [];
      parent.appendChild(newProject);
      return newProject;
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
    function advertisementExist(id: string) {
      let element = figma.root.findOne((node) => node.name.includes(id));
      if (element) {
        return element;
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
      let autoLayoutFrame;
      if (advertisementExist(meta.Id) != false) {
        let project = advertisementExist(meta.Id) as SceneNode;
        // remove all contents
        project.findAll((n) => n.type === "FRAME").forEach((n) => {
          if (!n.removed) {
            n.remove();
          }
        });
        autoLayoutFrame = project;
      } else {
        autoLayoutFrame = figma.createFrame();
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
        projectsFrame.fills = [];
        let projectFrame = projectLayout(meta.Project, projectsFrame);
        projectFrame.appendChild(autoLayoutFrame);
      }
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
        for (let textNode of instance.findAll(
          (n) => n.type === "TEXT"
        ) as TextNode[]) {
          if (element[textNode.name] !== undefined) {
            let rawValue = element[textNode.name];
            textNode.characters = "";
            if (typeof rawValue === "string" && rawValue.includes("**")) {
              let parts = rawValue.split("**");

              let isNextSegmentBold: boolean;
              if (rawValue.startsWith("**")) {
                isNextSegmentBold = true;
              } else {
                isNextSegmentBold = false;
              }

              for (let i = 0; i < parts.length; i++) {
                const segmentText = parts[i];

                if (
                  i === 0 &&
                  rawValue.startsWith("**") &&
                  segmentText === ""
                ) {
                  continue;
                }

                if (segmentText.length > 0) {
                  const start = textNode.characters.length;
                  textNode.insertCharacters(start, segmentText, "AFTER");

                  const styleToApply = isNextSegmentBold
                    ? "Semi Bold"
                    : "Regular";
                  // Need to await this, as setRangeFontName is async
                  await textNode.setRangeFontName(
                    start,
                    start + segmentText.length,
                    { family: "Inter", style: styleToApply }
                  );
                }

                // Toggle for the NEXT segment, unless it's an empty segment from "**" at the end of rawValue
                if (
                  !(
                    i === parts.length - 1 &&
                    rawValue.endsWith("**") &&
                    segmentText === ""
                  )
                ) {
                  isNextSegmentBold = !isNextSegmentBold;
                }
              }
            } else if (typeof rawValue === "string") {
              textNode.characters = rawValue;
              if (rawValue.length > 0) {
                await textNode.setRangeFontName(0, rawValue.length, {
                  family: "Inter",
                  style: "Regular",
                });
              }
            } else {
              textNode.characters = String(rawValue);
              if (textNode.characters.length > 0) {
                await textNode.setRangeFontName(0, textNode.characters.length, {
                  family: "Inter",
                  style: "Regular",
                });
              }
            }
          }
        }
        sizeContainer.appendChild(instance);
        instance.detachInstance();
        // set image
        if (sizeContainer.findOne((n) => n.name === "PicPlate") as any) {
          let imageContainer = sizeContainer.findOne(
            (n) => n.name === "PicPlate"
          ) as any;
          let render = getImage(element.Project);
          // copy of render
          if (render) {
            let zone = render.findOne(
              (n) => n.name === "Zone"
            ) as RectangleNode;
            if (zone) {
              let containerWidth = imageContainer.width;
              let containerHeight = imageContainer.height;
              let zoneWidth = zone.width;
              let zoneHeight = zone.height;
              let scale: number;
              if (
                zoneWidth <= 0 ||
                zoneHeight <= 0 ||
                containerWidth <= 0 ||
                containerHeight <= 0
              ) {
                scale = 1;
              } else {
                let scaleX = containerWidth / zoneWidth;
                let scaleY = containerHeight / zoneHeight;
                scale = Math.min(scaleX, scaleY);

                function willCover(scale: number) {
                  const zoneCX = (zone.x + zone.width / 2) * scale;
                  const zoneCY = (zone.y + zone.height / 2) * scale;

                  // Where the image's top-left corner will land after centring
                  const imgX = containerWidth / 2 - zoneCX;
                  const imgY = containerHeight / 2 - zoneCY;

                  // Image bounds in container space
                  const imgRight = imgX + render.width * scale;
                  const imgBottom = imgY + render.height * scale;

                  const xCovered = imgX <= 0 && imgRight >= containerWidth;
                  const yCovered = imgY <= 0 && imgBottom >= containerHeight;

                  return {
                    xCovered,
                    yCovered,
                    isFullyCovered: xCovered && yCovered,
                  };
                }
                let renderCopy = (
                  render?.findOne((n) => n.name === "Render") as SceneNode & {
                    clone: () => any;
                    resize: (w?: number, h?: number) => void;
                  }
                )?.clone();
                if (renderCopy && render) {
                  renderCopy.resize(
                    render.width * scale,
                    render.height * scale
                  );
                  let zoneCentre = {
                    x: (zone.x + zone.width / 2) * scale,
                    y: (zone.y + zone.height / 2) * scale,
                  };
                  let containerCentre = {
                    x: imageContainer.width / 2,
                    y: imageContainer.height / 2,
                  };
                  renderCopy.x = containerCentre.x - zoneCentre.x;
                  renderCopy.y = containerCentre.y - zoneCentre.y;

                  const coverage = willCover(scale);
                  if (!coverage.isFullyCovered) {
                    if (!coverage.xCovered) {
                      let scaleFactor = containerWidth / render.width;
                      renderCopy.resize(
                        containerWidth,
                        render.height * scaleFactor
                      );
                      zoneCentre = {
                        x: (zone.x + zone.width / 2) * scaleFactor,
                        y: (zone.y + zone.height / 2) * scaleFactor,
                      };
                      renderCopy.x = 0; // Center horizontally
                      renderCopy.y = containerCentre.y - zoneCentre.y;
                    }
                    // And/or vertically:
                    if (!coverage.yCovered) {
                      let scaleFactor = containerHeight / render.height;
                      renderCopy.resize(
                        render.width * scaleFactor,
                        containerHeight
                      );
                      zoneCentre = {
                        x: (zone.x + zone.width / 2) * scaleFactor,
                        y: (zone.y + zone.height / 2) * scaleFactor,
                      };
                      renderCopy.y = 0; // Align to top edge
                      renderCopy.x = containerCentre.x - zoneCentre.x; // Center horizontally
                    }

                    // Re-check coverage after the above conditional adjustments
                    const finalXCovered = renderCopy.x <= 0 && (renderCopy.x + renderCopy.width) >= containerWidth;
                    const finalYCovered = renderCopy.y <= 0 && (renderCopy.y + renderCopy.height) >= containerHeight;
                    const isNowFullyCovered = finalXCovered && finalYCovered;

                    if (!isNowFullyCovered) {
                      scale = Math.max(scaleX, scaleY);
                      renderCopy.resize(
                        render.width * scale,
                        render.height * scale
                      );
                      let zoneCentre = {
                        x: (zone.x + zone.width / 2) * scale,
                        y: (zone.y + zone.height / 2) * scale,
                      };
                      let containerCentre = {
                        x: imageContainer.width / 2,
                        y: imageContainer.height / 2,
                      };
                      renderCopy.x = containerCentre.x - zoneCentre.x;
                      renderCopy.y = containerCentre.y - zoneCentre.y;
                    }
                  }
                  imageContainer.appendChild(renderCopy);
                }
              }
            }
          }
        }
      }
    }

    let template = getTemplates();
    if (template) {
      msg.file.forEach((element: any) => {
        // normalize CSV values that may be quoted or padded by spaces
        const normalize = (v: any) => {
          if (v === undefined || v === null) return "";
          let s = String(v).trim();
          if (s.startsWith('"') && s.endsWith('"')) {
            s = s.slice(1, -1);
          }
          return s.trim();
        };

        const autoValue = normalize((element as any).auto ?? (element as any).Auto);
        const statusValue = normalize((element as any).status ?? (element as any).Status);

        const isAuto = autoValue.toLowerCase() === "true";
        const isReadyStatus = statusValue.toLowerCase() === "взять в работу";

        if (!(isAuto && isReadyStatus)) {
          return; // пропустить этот проект если не отмечен для авто и статус "взять в работу"
        }

        let page = unitPage(element.Unit) as PageNode;
        createFrames(template, element, page);
      });
    }
    figma.closePlugin();
  }
};
