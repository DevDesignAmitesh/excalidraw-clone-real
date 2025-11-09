import { shapesStorage } from "@/shapes-storage";
import { Shape, toolType } from "@/utils/types";
import { v4 as uuid } from "uuid";

export class CanvasEngine {
  public tool: toolType;
  public theme: string;
  public setSelectedShapeId: (input: string | null) => void;
  public isDrawing: boolean = false;
  public startX: number = 0;
  public startY: number = 0;
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public pencilPath: { x: number; y: number }[] = [];

  constructor(
    tool: toolType,
    theme: string,
    setSelectedShapeId: (input: string | null) => void,
    canvasRef: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.tool = tool;
    this.theme = theme;
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
      console.log("clicked");
      this.selectShapeAt(e.clientX, e.clientY);
    }
  };

  renderAllTheShapes = () => {
    const allShapes = shapesStorage.getAllShapes();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    allShapes.forEach((item) => {
      if (item.type === "circle") {
        const { radius, x, y } = item;
        this.createCircle({
          radius,
          xAxis: x,
          yAxis: y,
        });
      } else if (item.type === "pencil") {
        const { path } = item;
        this.createPencil({
          path,
        });
      } else if (item.type === "rectangle") {
        const { height, width, x, y } = item;
        this.createRect({
          h: height,
          w: width,
          xAxis: x,
          yAxis: y,
        });
      } else if (item.type === "text") {
        const { input, x, y } = item;
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = this.theme === "dark" ? "#fff" : "#000";
        this.ctx.fillText(input, x, y);
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

    if (this.tool === "rectangle") {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      shape = {
        id: uuid(),
        type: "rectangle",
        width,
        height,
        x: this.startX,
        y: this.startY,
        bgColor: this.theme === "dark" ? "#121212" : "#fff",
        borderRadius: "0px",
        strokeColor: "",
        strokeStyle: "",
      };
    } else if (this.tool === "circle") {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      shape = {
        id: uuid(),
        type: "circle",
        x: this.startX,
        y: this.startY,
        radius,
      };
    } else if (this.tool === "pencil") {
      shape = {
        id: uuid(),
        type: "pencil",
        path: this.pencilPath,
      };
    }

    if (shape) shapesStorage.saveShape(shape);
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.isDrawing) return;

    if (this.tool === "eraser") {
      this.eraseShapeAt(e.offsetX, e.offsetY);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderAllTheShapes();

    if (this.tool === "rectangle") {
      this.ctx.beginPath();
      this.createRect({ e });
      return;
    } else if (this.tool === "circle") {
      this.ctx.beginPath();
      this.createCircle({ e });
      return;
    } else if (this.tool === "pencil") {
      this.pencilPath.push({ x: e.offsetX, y: e.offsetY });
      this.createPencil({ path: this.pencilPath });
      return;
    }
  };

  createRect = (e: MouseEvent, shape: Shape) => {
    if (shape.type === "rectangle") {
      const width = shape.width ?? (e ? e.clientX - this.startX : 0);
      const height = shape.height ?? (e ? e.clientY - this.startY : 0);
      const x = shape.x ?? this.startX;
      const y = shape.y ?? this.startY;

      this.ctx.strokeStyle =
        (shape.strokeColor ?? this.theme === "dark") ? "#fff" : "#000";
      this.ctx.strokeRect(x, y, width, height);
    }
  };

  createCircle = (e: MouseEvent, shape: Shape) => {
    if (shape.type === "circle") {
      const dx = e ? e.clientX - this.startX : 0;
      const dy = e ? e.clientY - this.startY : 0;
      const r = shape.radius ?? Math.sqrt(dx * dx + dy * dy);
      const x = shape.x ?? this.startX;
      const y = shape.y ?? this.startY;

      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.strokeStyle =
        (shape.strokeColor ?? this.theme === "dark") ? "#fff" : "#000";
      this.ctx.stroke();
    }
  };

  createPencil = (shape: Shape) => {
    if (shape.type === "pencil") {
      if (!shape.path) return;

      this.ctx.beginPath();
      this.ctx.moveTo(shape.path[0].x, shape.path[0].y);

      for (let i = 1; i < shape.path.length; i++) {
        this.ctx.lineTo(shape.path[i].x, shape.path[i].y);
      }

      this.ctx.strokeStyle =
        (shape.strokeColor ?? this.theme === "dark") ? "#fff" : "#000";
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = this.theme === "dark" ? "#fff" : "#000";
      this.ctx.stroke();
    }
  };

  createText = (inputShape: Shape) => {
    if (inputShape.type === "text") {
      this.ctx.font = "20px serif";
      this.ctx.fillStyle = this.theme === "dark" ? "#fff" : "#000";
      this.ctx.fillText(inputShape.input, inputShape.x, inputShape.y);

      let shape: Shape = {
        id: uuid(),
        type: "text",
        x: inputShape.x,
        y: inputShape.y,
        input: inputShape.input,
      };

      shapesStorage.saveShape(shape);
      this.renderAllTheShapes();
    }
  };

  eraseShapeAt = (x: number, y: number) => {
    const allShapes = shapesStorage.getAllShapes();
    const ERASER_RADIUS = 10; // can tweak this for comfort

    // simple hit detection for each shape
    for (const shape of allShapes) {
      if (shape.type === "rectangle") {
        if (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        ) {
          shapesStorage.deleteShape(shape.id);
        }
      }

      if (shape.type === "circle") {
        const dx = x - shape.x;
        const dy = y - shape.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= (shape.radius ?? 0)) {
          shapesStorage.deleteShape(shape.id);
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
            shapesStorage.deleteShape(shape.id);
            break;
          }
        }
      }

      if (shape.type === "text" && shape.input) {
        this.ctx.font = "20px serif"; // use same font as when you draw it
        const textWidth = this.ctx.measureText(shape.input).width;
        const textHeight = 20; // approximate text height
        const withinX = x >= shape.x && x <= shape.x + textWidth;
        const withinY = y >= shape.y - textHeight && y <= shape.y;
        if (withinX && withinY) {
          shapesStorage.deleteShape(shape.id);
          continue;
        }
      }
    }

    // re-render after deletion
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderAllTheShapes();
  };

  selectShapeAt = (x: number, y: number) => {
    const allShapes = shapesStorage.getAllShapes();
    const ERASER_RADIUS = 10; // can tweak this for comfort

    console.log(x, y);
    // simple hit detection for each shape
    for (const shape of allShapes) {
      if (shape.type === "rectangle") {
        if (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
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
        const dx = x - shape.x;
        const dy = y - shape.y;
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
        const withinX = x >= shape.x && x <= shape.x + textWidth;
        const withinY = y >= shape.y - textHeight && y <= shape.y;
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
