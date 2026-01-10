import { shapesStorage } from "@/shapes-storage";
import { Shape, toolType } from "@/utils/types";
import { v4 as uuid } from "uuid";

export class CanvasEngine {
  public tool: toolType;
  public setSelectedTool: (e: toolType) => void;
  public shapesDetails: Shape;
  public theme: string;
  public themedColor: string;
  public isDrawing: boolean = false;
  public hasMove: boolean = false;
  public startX: number = 0;
  public startY: number = 0;
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public pencilPath: { x: number; y: number }[] = [];
  public selectedShapeId: string | null;
  public toggleSelectedShapeId: (e: string | null) => void;

  constructor(
    shapesDetails: Shape,
    tool: toolType,
    setSelectedTool: (e: toolType) => void,
    toggleSelectedShapeId: (e: string | null) => void,
    selectedShapeId: string | null,
    theme: string,
    themedColor: string,
    canvasRef: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.shapesDetails = shapesDetails;
    this.tool = tool;
    this.setSelectedTool = setSelectedTool;
    this.toggleSelectedShapeId = toggleSelectedShapeId;
    this.theme = theme;
    this.selectedShapeId = selectedShapeId;
    this.themedColor = themedColor;
    this.canvas = canvasRef;
    this.ctx = ctx;
    this.renderAllTheShapes();
  }

  updateEngine = (
    shapesDetails: Shape,
    tool: toolType,
    selectedShapeId: string | null,
    theme: string,
    themedColor: string
  ) => {
    this.shapesDetails = shapesDetails;
    this.tool = tool;
    this.selectedShapeId = selectedShapeId;
    this.theme = theme;
    this.themedColor = themedColor;
  };

  startFn = () => {
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("keydown", this.handleKeyDown);
  };

  endFn = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("keydown", this.handleKeyDown);
  };

  renderAllTheShapes = () => {
    const allShapes = shapesStorage.getAllShapes();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    allShapes.forEach((item) => {
      if (item.type === "circle") {
        this.ctx.beginPath();
        this.createCircle({ savedShape: item });
        if (item.isSelected) {
          this.drawSelectionBox(this.ctx, item);
        }
      } else if (item.type === "pencil") {
        this.createPencil({ savedShape: item });
        if (item.isSelected) {
          this.drawSelectionBox(this.ctx, item);
        }
      } else if (item.type === "rectangle") {
        this.ctx.beginPath();
        this.createRect({ savedShape: item });
        if (item.isSelected) {
          this.drawSelectionBox(this.ctx, item);
        }
      } else if (item.type === "text") {
        this.createText({ inputShape: item, isNew: false });
        if (item.isSelected) {
          this.drawSelectionBox(this.ctx, item);
        }
      }
    });
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      this.deleteOneShape();
      this.renderAllTheShapes();
    }
  };

  handleMouseDown = (e: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.hasMove = false;
    this.isDrawing = true;
    this.startX = x;
    this.startY = y;
    if (this.tool === "pencil") {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.pencilPath = [{ x, y }];
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    if (!this.hasMove) {
      this.isDrawing = false;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.selectShapeAt(x, y);

      return;
    }

    if (!this.isDrawing) return;
    this.isDrawing = false;
    if (this.tool !== "pencil") {
      this.ctx.closePath();
    }
    this.setSelectedTool("mouse");

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

    if (shape) {
      shapesStorage.saveShape(shape);
      this.renderAllTheShapes();
    }

    if (this.tool === "pencil") {
      this.pencilPath = [];
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    if (!this.isDrawing) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    if (
      (this.tool === "hand" || this.tool === "mouse") &&
      this.selectedShapeId &&
      this.isDrawing
    ) {
      const dx = x - this.startX;
      const dy = y - this.startY;

      const shape = shapesStorage.getShape(this.selectedShapeId);

      if (!shape) return;

      if (shape?.type === "pencil") {
        this.movePencil(shape, dx, dy);
      } else {
        // normal shapes
        shapesStorage.updateShape(this.selectedShapeId, {
          x: (shape.x ?? 0) + dx,
          y: (shape.y ?? 0) + dy,
        });
      }

      this.startX = x;
      this.startY = y;

      this.renderAllTheShapes();
      return;
    }

    this.hasMove = true;

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
      this.pencilPath.push({ x, y });
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
    const shape = initialShape ?? savedShape;
    if (!shape || shape.type !== "rectangle") return;

    const { bgColor, borderRadius, opacity, strokeColor, strokeStyle } = shape;

    // ---------- position & size ----------
    const isLive = !!(initialShape && e);

    const X = isLive ? this.startX : shape.x!;
    const Y = isLive ? this.startY : shape.y!;

    const WIDTH = isLive ? e!.clientX - this.startX : shape.width!;

    const HEIGHT = isLive ? e!.clientY - this.startY : shape.height!;

    const themedColor = this.theme === "dark" ? "#fff" : "#000";

    // ---------- draw ----------
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.globalAlpha = opacity;

    // stroke style
    switch (strokeStyle) {
      case "dashed":
        this.ctx.setLineDash([10, 5]);
        break;
      case "dotted":
        this.ctx.setLineDash([2, 6]);
        break;
      default:
        this.ctx.setLineDash([]);
    }

    // shape path
    this.ctx.roundRect(X, Y, WIDTH, HEIGHT, borderRadius);

    // fill
    if (bgColor && bgColor !== "") {
      this.ctx.fillStyle =
        bgColor !== "#fff" && bgColor !== "#000" ? bgColor : themedColor;
      this.ctx.fill();
    }

    // stroke (always)
    this.ctx.strokeStyle =
      strokeColor !== "#fff" && strokeColor !== "#000"
        ? strokeColor
        : themedColor;

    this.ctx.stroke();

    // reset canvas state
    this.ctx.restore();
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
    const shape = initialShape ?? savedShape;
    if (!shape || shape.type !== "circle") return;

    const { bgColor, opacity, strokeColor } = shape;

    const X = initialShape ? this.startX : shape.x!;
    const Y = initialShape ? this.startY : shape.y!;
    const r = initialShape
      ? Math.hypot(e!.clientX - this.startX, e!.clientY - this.startY)
      : shape.radius!;

    const themedColor = this.theme === "dark" ? "#fff" : "#000";

    this.ctx.save();
    this.ctx.beginPath();

    this.ctx.globalAlpha = opacity;
    this.ctx.arc(X, Y, r, 0, Math.PI * 2);

    // ---- fill ----
    if (bgColor && bgColor !== "") {
      this.ctx.fillStyle =
        bgColor !== "#fff" && bgColor !== "#000" ? bgColor : themedColor;
      this.ctx.fill();
    }

    // ---- stroke (always) ----
    this.ctx.strokeStyle =
      strokeColor !== "#fff" && strokeColor !== "#000"
        ? strokeColor
        : themedColor;

    this.ctx.stroke();

    this.ctx.restore();
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
    const shape = initialShape ?? savedShape;
    if (!shape || shape.type !== "pencil") return;

    const drawPath = initialShape ? path : shape.path;
    if (!drawPath || drawPath.length < 2) return;

    const { opacity, strokeColor } = shape;
    const themedColor = this.theme === "dark" ? "#fff" : "#000";

    this.ctx.save();
    this.ctx.beginPath();

    this.ctx.moveTo(drawPath[0].x, drawPath[0].y);
    for (let i = 1; i < drawPath.length; i++) {
      this.ctx.lineTo(drawPath[i].x, drawPath[i].y);
    }

    this.ctx.globalAlpha = opacity;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.ctx.strokeStyle =
      strokeColor !== "#fff" && strokeColor !== "#000"
        ? strokeColor
        : themedColor;

    this.ctx.stroke();
    this.ctx.restore();
  };

  createText = ({
    inputShape,
    isNew,
  }: {
    inputShape: Shape;
    isNew: boolean;
  }) => {
    if (inputShape.type !== "text") return;

    const { color, input, opacity, x, y, font, fontSize } = inputShape;
    const themedColor = this.theme === "dark" ? "#fff" : "#000";

    this.ctx.save();

    this.ctx.font = `${fontSize}px ${font}`;
    this.ctx.globalAlpha = opacity;

    this.ctx.fillStyle =
      color !== "#fff" && color !== "#000" ? color : themedColor;

    this.ctx.fillText(input, x!, y!);

    this.ctx.restore();

    if (isNew) {
      shapesStorage.saveShape(inputShape);
      this.renderAllTheShapes();
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
          this.toggleSelectedShapeId(shape.id);
          shapesStorage.updateShape(shape.id, {
            isSelected: true,
          });
        } else {
          this.toggleSelectedShapeId(null);
          shapesStorage.updateShape(shape.id, {
            isSelected: false,
          });
        }
      } else if (shape.type === "circle") {
        const dx = x - shape.x!;
        const dy = y - shape.y!;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= (shape.radius ?? 0)) {
          this.toggleSelectedShapeId(shape.id);
          shapesStorage.updateShape(shape.id, {
            isSelected: true,
          });
          // MAKE A FN FOR TOGGLING THE SELCTED SHAPE ID
        } else {
          this.toggleSelectedShapeId(null);
          shapesStorage.updateShape(shape.id, {
            isSelected: false,
          });
        }
      } else if (
        shape.type === "pencil" &&
        shape.path &&
        shape.path.length > 0
      ) {
        for (let i = 0; i < shape.path.length - 1; i++) {
          const px = shape.path[i].x;
          const py = shape.path[i].y;
          const dx = x - px;
          const dy = y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= ERASER_RADIUS) {
            this.toggleSelectedShapeId(shape.id);
            shapesStorage.updateShape(shape.id, {
              isSelected: true,
            });
            break;
          } else {
            this.toggleSelectedShapeId(null);
            shapesStorage.updateShape(shape.id, {
              isSelected: false,
            });
          }
        }
      } else if (shape.type === "text" && shape.input) {
        this.ctx.font = "20px serif"; // use same font as when you draw it
        const textWidth = this.ctx.measureText(shape.input).width;
        const textHeight = 20; // approximate text height
        const withinX = x >= shape.x! && x <= shape.x! + textWidth;
        const withinY = y >= shape.y! - textHeight && y <= shape.y!;
        if (withinX && withinY) {
          this.toggleSelectedShapeId(shape.id);
          shapesStorage.updateShape(shape.id, {
            isSelected: true,
          });
          continue;
        } else {
          this.toggleSelectedShapeId(null);
          shapesStorage.updateShape(shape.id, {
            isSelected: false,
          });
        }
      }
    }

    // re-render after deletion
    this.renderAllTheShapes();
  };

  drawSelectionBox = (ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.save();
    ctx.strokeStyle = "#4a90e2";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);

    const PADDING = 6;

    if (shape.type === "rectangle") {
      ctx.strokeRect(
        shape.x! - PADDING,
        shape.y! - PADDING,
        shape.width! + PADDING * 2,
        shape.height! + PADDING * 2
      );
    }

    if (shape.type === "circle") {
      const diameter = shape.radius! * 2;
      ctx.strokeRect(
        shape.x! - shape.radius! - PADDING,
        shape.y! - shape.radius! - PADDING,
        diameter + PADDING * 2,
        diameter + PADDING * 2
      );
    }

    if (shape.type === "text") {
      ctx.font = `${shape.fontSize}px ${shape.font}`;

      const metrics = ctx.measureText(shape.input);
      const width = metrics.width;
      const height =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      ctx.strokeRect(
        shape.x! - PADDING,
        shape.y! - height - PADDING,
        width + PADDING * 2,
        height + PADDING * 2
      );
    }

    if (shape.type === "pencil") {
      const xs = shape.path!.map((p) => p.x);
      const ys = shape.path!.map((p) => p.y);

      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);

      ctx.strokeRect(
        minX - PADDING,
        minY - PADDING,
        maxX - minX + PADDING * 2,
        maxY - minY + PADDING * 2
      );
    }

    ctx.restore();
  };

  deleteOneShape = () => {
    if (!this.selectedShapeId) return;
    shapesStorage.deleteShape(this.selectedShapeId);
    this.renderAllTheShapes();
  };

  clearCanvas = () => {
    shapesStorage.deleteAllShapes();
    this.renderAllTheShapes();
  };

  movePencil = (shape: Shape, dx: number, dy: number) => {
    console.log("running");
    if (shape.type === "pencil") {
      shape.path = shape.path?.map((p) => ({
        x: p.x + dx,
        y: p.y + dy,
      }));
    }

    shapesStorage.updateShape(shape.id, shape);
  };
}
