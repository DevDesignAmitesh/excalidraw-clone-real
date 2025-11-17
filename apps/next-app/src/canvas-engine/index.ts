import { shapesStorage } from "@/shapes-storage";
import { Shape, toolType } from "@/utils/types";
import { v4 as uuid } from "uuid";

export class CanvasEngine {
  public tool: toolType;
  public shapesDetails: Shape;
  public theme: string;
  public themedColor: string;
  public setSelectedShapeId: (input: string | null) => void;
  public isDrawing: boolean = false;
  public startX: number = 0;
  public startY: number = 0;
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public pencilPath: { x: number; y: number }[] = [];

  constructor(
    shapesDetails: Shape,
    tool: toolType,
    theme: string,
    themedColor: string,
    setSelectedShapeId: (input: string | null) => void,
    canvasRef: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.shapesDetails = shapesDetails;
    this.tool = tool;
    this.theme = theme;
    this.themedColor = themedColor;
    this.canvas = canvasRef;
    this.setSelectedShapeId = setSelectedShapeId;
    this.ctx = ctx;
    this.startFn();
    this.renderAllTheShapes();
  }

  startFn = () => {
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("click", this.handleClick);
  };

  endFn = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("click", this.handleClick);
  };

  handleClick = (e: PointerEvent) => {
    if (this.tool === "hand") {
      this.selectShapeAt(e.clientX, e.clientY);
    }
  };

  renderAllTheShapes = () => {
    const allShapes = shapesStorage.getAllShapes();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    allShapes.forEach((item) => {
      if (item.type === "circle") {
        this.createCircle({ savedShape: item });
      } else if (item.type === "pencil") {
        this.createPencil({ savedShape: item });
      } else if (item.type === "rectangle") {
        this.createRect({ savedShape: item });
      } else if (item.type === "text") {
        this.createText({ inputShape: item, isNew: false });
      }
    });
  };

  handleMouseDown = (e: MouseEvent) => {
    this.isDrawing = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    if (this.tool === "pencil") {
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
      this.pencilPath = [{ x: e.offsetX, y: e.offsetY }];
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.ctx.closePath();

    let shape: Shape | null = null;

    if (this.tool === "rectangle" && this.shapesDetails.type === "rectangle") {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      shape = {
        id: uuid(),
        type: "rectangle",
        width,
        height,
        x: this.startX,
        y: this.startY,
        bgColor: this.shapesDetails.bgColor,
        borderRadius: this.shapesDetails.borderRadius,
        strokeColor: this.shapesDetails.strokeColor,
        strokeStyle: this.shapesDetails.strokeStyle,
        opacity: this.shapesDetails.opacity,
      };
    } else if (this.tool === "circle" && this.shapesDetails.type === "circle") {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      shape = {
        id: uuid(),
        type: "circle",
        x: this.startX,
        y: this.startY,
        radius,
        bgColor: this.shapesDetails.bgColor,
        opacity: this.shapesDetails.opacity,
        strokeColor: this.shapesDetails.strokeColor,
      };
    } else if (this.tool === "pencil" && this.shapesDetails.type === "pencil") {
      shape = {
        id: uuid(),
        type: "pencil",
        path: this.pencilPath,
        opacity: this.shapesDetails.opacity,
        strokeColor: this.shapesDetails.strokeColor,
      };
    }
    console.log("this is the final shape after mouse up", shape);
    if (shape) {
      shapesStorage.saveShape(shape);
      this.renderAllTheShapes();
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    if (this.tool === "eraser") {
      this.eraseShapeAt(x, y);
      return;
    }

    this.renderAllTheShapes();

    if (this.tool === "rectangle") {
      this.ctx.beginPath();
      this.createRect({ e, initialShape: this.shapesDetails });
      return;
    } else if (this.tool === "circle") {
      this.ctx.beginPath();
      this.createCircle({ e, initialShape: this.shapesDetails });
      return;
    } else if (this.tool === "pencil") {
      this.pencilPath.push({ x: e.offsetX, y: e.offsetY });
      this.createPencil({
        path: this.pencilPath,
        initialShape: this.shapesDetails,
      });
      return;
    }
  };

  createRect = ({
    e,
    initialShape,
    savedShape,
  }: {
    e?: MouseEvent;
    initialShape?: Shape;
    savedShape?: Shape;
  }) => {
    if (initialShape && e) {
      const { type } = initialShape;
      if (type !== "rectangle") {
        return;
      }

      const { bgColor, borderRadius, opacity, strokeColor, strokeStyle } =
        initialShape;
      const WIDTH = e.clientX - this.startX;
      const HEIGHT = e.clientY - this.startY;
      const X = this.startX;
      const Y = this.startY;

      const themedColor = this.theme === "dark" ? "#fff" : "#000";

      // just for this shape
      this.ctx.globalAlpha = opacity;

      if (strokeStyle === "dashed") {
        this.ctx.setLineDash([10, 5]); // 10px line, 5px gap
      } else if (strokeStyle === "dotted") {
        this.ctx.setLineDash([1, 5]); // 1px dot, 5px gap
      } else if (strokeStyle === "line") {
        this.ctx.setLineDash([0, 0]); // 0px dot, 0px gap
      }

      this.ctx.roundRect(X, Y, WIDTH, HEIGHT, borderRadius);

      if (bgColor !== "") {
        if (bgColor !== "#fff" && bgColor !== "#000") {
          this.ctx.fillStyle = bgColor;
        } else {
          this.ctx.fillStyle = themedColor;
        }

        this.ctx.fill();
      } else {
        if (strokeColor !== "#fff" && strokeColor !== "#000") {
          this.ctx.strokeStyle = strokeColor;
        }

        this.ctx.strokeStyle = themedColor;
        this.ctx.stroke();
      }

      // back to normal
      this.ctx.globalAlpha = 1.0;

      // Reset dashes after drawing
      this.ctx.setLineDash([]);
    } else if (savedShape) {
      const { type } = savedShape;
      if (type !== "rectangle") {
        return;
      }
      const {
        bgColor,
        borderRadius,
        height,
        opacity,
        strokeColor,
        strokeStyle,
        width,
        x,
        y,
      } = savedShape;
      const WIDTH = width!;
      const HEIGHT = height!;
      const X = x!;
      const Y = y!;

      const themedColor = this.theme === "dark" ? "#fff" : "#000";

      // just for this shape
      this.ctx.globalAlpha = opacity;

      if (strokeStyle === "dashed") {
        this.ctx.setLineDash([10, 5]); // 10px line, 5px gap
      } else if (strokeStyle === "dotted") {
        this.ctx.setLineDash([1, 5]); // 1px dot, 5px gap
      } else if (strokeStyle === "line") {
        this.ctx.setLineDash([0, 0]); // 0px dot, 0px gap
      }

      this.ctx.roundRect(X, Y, WIDTH, HEIGHT, borderRadius);

      if (bgColor !== "") {
        if (bgColor !== "#fff" && bgColor !== "#000") {
          this.ctx.fillStyle = bgColor;
        } else {
          this.ctx.fillStyle = themedColor;
        }

        this.ctx.fill();
      } else {
        if (strokeColor !== "#fff" && strokeColor !== "#000") {
          this.ctx.strokeStyle = strokeColor;
        }

        this.ctx.strokeStyle = themedColor;
        this.ctx.stroke();
      }

      // back to normal
      this.ctx.globalAlpha = 1.0;

      // Reset dashes after drawing
      this.ctx.setLineDash([]);
    }
  };

  createCircle = ({
    e,
    initialShape,
    savedShape,
  }: {
    e?: MouseEvent;
    initialShape?: Shape;
    savedShape?: Shape;
  }) => {
    if (initialShape && e) {
      console.log("this is the initial shape", initialShape);
      if (initialShape.type === "circle") {
        const { bgColor, opacity, strokeColor } = initialShape;
        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;
        const r = Math.sqrt(dx * dx + dy * dy);
        const X = this.startX;
        const Y = this.startY;

        const themedColor = this.theme === "dark" ? "#fff" : "#000";
        this.ctx.beginPath();
        // for just this shape
        this.ctx.globalAlpha = opacity;
        this.ctx.arc(X, Y, r, 0, 2 * Math.PI);

        if (bgColor !== "") {
          if (bgColor !== "#fff" && bgColor !== "#000") {
            this.ctx.fillStyle = bgColor;
          } else {
            this.ctx.fillStyle = themedColor;
          }
          this.ctx.fill();
        } else {
          if (strokeColor !== "#fff" && strokeColor !== "#000") {
            this.ctx.strokeStyle = strokeColor;
          } else {
            this.ctx.strokeStyle = themedColor;
          }
          this.ctx.stroke();
        }
        // 0.0 to 1.0
        this.ctx.globalAlpha = 1.0;
      }
    } else if (savedShape) {
      if (savedShape.type === "circle") {
        console.log(
          "this is the circle shape which is gonna rendered",
          savedShape
        );
        const { bgColor, opacity, strokeColor, radius, x, y } = savedShape;
        const r = radius!;
        const X = x!;
        const Y = y!;

        const themedColor = this.theme === "dark" ? "#fff" : "#000";
        this.ctx.beginPath();
        // for just this shape
        this.ctx.globalAlpha = opacity;
        this.ctx.arc(X, Y, r, 0, 2 * Math.PI);

        if (bgColor !== "") {
          if (bgColor !== "#fff" && bgColor !== "#000") {
            this.ctx.fillStyle = bgColor;
          } else {
            this.ctx.fillStyle = themedColor;
          }
          this.ctx.fill();
        } else {
          if (strokeColor !== "#fff" && strokeColor !== "#000") {
            this.ctx.strokeStyle = strokeColor;
          } else {
            this.ctx.strokeStyle = themedColor;
          }
          this.ctx.stroke();
        }
        // 0.0 to 1.0
        this.ctx.globalAlpha = 1.0;
      }
    }
  };

  createPencil = ({
    path,
    savedShape,
    initialShape,
  }: {
    path?: { x: number; y: number }[];
    initialShape?: Shape;
    savedShape?: Shape;
  }) => {
    if (path && initialShape) {
      if (initialShape.type === "pencil") {
        const { opacity, strokeColor } = initialShape;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path.length; i++) {
          this.ctx.lineTo(path[i].x, path[i].y);
        }

        const themedColor = this.theme === "dark" ? "#fff" : "#000";

        if (strokeColor !== "#fff" && strokeColor !== "#000") {
          this.ctx.strokeStyle = strokeColor;
        } else {
          this.ctx.strokeStyle = themedColor;
        }
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        // for this shape only
        this.ctx.globalAlpha = opacity;
        this.ctx.stroke();

        // reseting it for rest of the images
        this.ctx.globalAlpha = 1.0;
      }
      return;
    } else if (savedShape) {
      if (savedShape.type === "pencil" && savedShape.path) {
        const { opacity, path, strokeColor } = savedShape;

        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x, path[0].y);

        for (let i = 1; i < path!.length; i++) {
          this.ctx.lineTo(path[i].x, path[i].y);
        }

        const themedColor = this.theme === "dark" ? "#fff" : "#000";

        if (strokeColor !== "#fff" && strokeColor !== "#000") {
          this.ctx.strokeStyle = strokeColor;
        } else {
          this.ctx.strokeStyle = themedColor;
        }

        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        // for this shape only
        this.ctx.globalAlpha = opacity;
        this.ctx.stroke();

        // reseting it for rest of the images
        this.ctx.globalAlpha = 1.0;
      }
    }
  };

  createText = ({
    inputShape,
    isNew,
  }: {
    inputShape: Shape;
    isNew: boolean;
  }) => {
    if (inputShape.type === "text") {
      const { color, input, opacity, x, y, font, fontSize } = inputShape;

      this.ctx.font = `${fontSize} ${font}`;

      // for this shape
      this.ctx.globalAlpha = opacity;

      const themedColor = this.theme === "dark" ? "#fff" : "#000";

      if (color !== "#fff" && color !== "#000") {
        this.ctx.fillStyle = color;
      } else {
        this.ctx.fillStyle = themedColor;
      }
      this.ctx.fillText(input, x!, y!);

      if (isNew) {
        shapesStorage.saveShape(inputShape);
        this.renderAllTheShapes();
      }

      // reseting it
      this.ctx.globalAlpha = 1.0;
    }
  };

  eraseShapeAt = (x: number, y: number) => {
    const allShapes = shapesStorage.getAllShapes();
    const ERASER_RADIUS = 10; // can tweak this for comfort
    const deletedShapeIds: string[] = []; // for stroing the deleted shapes's ids

    // simple hit detection for each shape
    for (const shape of allShapes) {
      if (shape.type === "rectangle") {
        if (
          x >= shape.x! &&
          x <= shape.x! + shape.width! &&
          y >= shape.y! &&
          y <= shape.y! + shape.height!
        ) {
          deletedShapeIds.push(shape.id);
        }
      }

      if (shape.type === "circle") {
        const dx = x - shape.x!;
        const dy = y - shape.y!;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= (shape.radius ?? 0)) {
          deletedShapeIds.push(shape.id);
        }
      }

      if (shape.type === "pencil" && shape.path && shape.path.length > 0) {
        // assume pencil is a small point or path — you can use a distance threshold

        for (let i = 0; i < shape.path.length - 1; i++) {
          const px = shape.path[i].x;
          const py = shape.path[i].y;
          const dx = x - px;
          const dy = y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= ERASER_RADIUS) {
            deletedShapeIds.push(shape.id);
            break;
          }
        }
      }

      if (shape.type === "text" && shape.input) {
        this.ctx.font = "20px serif"; // use same font as when you draw it
        const textWidth = this.ctx.measureText(shape.input).width;
        const textHeight = 20; // approximate text height
        const withinX = x >= shape.x! && x <= shape.x! + textWidth;
        const withinY = y >= shape.y! - textHeight && y <= shape.y!;
        if (withinX && withinY) {
          deletedShapeIds.push(shape.id);
          continue;
        }
      }
    }

    // re-render after deletion
    deletedShapeIds.forEach((id) => shapesStorage.deleteShape(id));
    this.renderAllTheShapes();
  };

  selectShapeAt = (x: number, y: number) => {
    const allShapes = shapesStorage.getAllShapes();
    const ERASER_RADIUS = 10; // can tweak this for comfort

    // simple hit detection for each shape
    for (const shape of allShapes) {
      if (shape.type === "rectangle") {
        if (
          x >= shape.x! &&
          x <= shape.x! + shape.width! &&
          y >= shape.y! &&
          y <= shape.y! + shape.height!
        ) {
          this.setSelectedShapeId(shape.id);
          shapesStorage.updateShape(shape.id, {
            strokeColor: "red",
          });
        } else {
          this.setSelectedShapeId(null);
          shapesStorage.updateShape(shape.id, shape);
        }
      }

      if (shape.type === "circle") {
        const dx = x - shape.x!;
        const dy = y - shape.y!;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= (shape.radius ?? 0)) {
          this.setSelectedShapeId(shape.id);
          shapesStorage.updateShape(shape.id, {
            strokeColor: "red",
          });
        } else {
          this.setSelectedShapeId(null);
          shapesStorage.updateShape(shape.id, shape);
        }
      }

      if (shape.type === "pencil" && shape.path && shape.path.length > 0) {
        // assume pencil is a small point or path — you can use a distance threshold

        for (let i = 0; i < shape.path.length - 1; i++) {
          const px = shape.path[i].x;
          const py = shape.path[i].y;
          const dx = x - px;
          const dy = y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= ERASER_RADIUS) {
            this.setSelectedShapeId(shape.id);
            shapesStorage.updateShape(shape.id, {
              strokeColor: "red",
            });
            break;
          } else {
            this.setSelectedShapeId(null);
            shapesStorage.updateShape(shape.id, shape);
          }
        }
      }

      if (shape.type === "text" && shape.input) {
        this.ctx.font = "20px serif"; // use same font as when you draw it
        const textWidth = this.ctx.measureText(shape.input).width;
        const textHeight = 20; // approximate text height
        const withinX = x >= shape.x! && x <= shape.x! + textWidth;
        const withinY = y >= shape.y! - textHeight && y <= shape.y!;
        if (withinX && withinY) {
          this.setSelectedShapeId(shape.id);
          shapesStorage.updateShape(shape.id, {
            strokeColor: "red",
          });
          continue;
        } else {
          this.setSelectedShapeId(null);
          shapesStorage.updateShape(shape.id, shape);
        }
      }
    }

    // re-render after deletion
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderAllTheShapes();
  };
}
