import { shapesStorage } from "@/shapes-storage";
import { Shape, toolType } from "@/utils/types";
import { v4 as uuid } from "uuid";

export class CanvasEngine {
  public tool: toolType;
  public theme: string;
  public isDrawing: boolean = false;
  public startX: number = 0;
  public startY: number = 0;
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public pencilPath: { x: number; y: number }[] = [];

  constructor(
    tool: toolType,
    theme: string,
    canvasRef: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.tool = tool;
    this.theme = theme;
    this.canvas = canvasRef;
    this.ctx = ctx;
    this.startFn();
    this.renderAllTheShapes();
  }

  startFn = () => {
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
  };

  endFn = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
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

  createRect = ({
    e,
    w,
    h,
    xAxis,
    yAxis,
  }: {
    e?: MouseEvent;
    w?: number;
    h?: number;
    xAxis?: number;
    yAxis?: number;
  }) => {
    console.log("rect");

    const width = w ?? (e ? e.clientX - this.startX : 0);
    const height = h ?? (e ? e.clientY - this.startY : 0);
    const x = xAxis ?? this.startX;
    const y = yAxis ?? this.startY;

    this.ctx.strokeRect(x, y, width, height);
  };

  createCircle = ({
    e,
    radius,
    xAxis,
    yAxis,
  }: {
    e?: MouseEvent;
    radius?: number;
    xAxis?: number;
    yAxis?: number;
  }) => {
    console.log("circle");

    const dx = e ? e.clientX - this.startX : 0;
    const dy = e ? e.clientY - this.startY : 0;
    const r = radius ?? Math.sqrt(dx * dx + dy * dy);
    const x = xAxis ?? this.startX;
    const y = yAxis ?? this.startY;

    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.stroke();
  };

  createPencil = ({ path }: { path?: { x: number; y: number }[] }) => {
    if (!path) return;

    this.ctx.beginPath();
    this.ctx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
      this.ctx.lineTo(path[i].x, path[i].y);
    }

    this.ctx.strokeStyle = this.theme === "dark" ? "#fff" : "#000";
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.stroke();
  };
}
