import { Shape } from "@/utils/types";

class ShapesStorage {
  saveShape(shape: Shape) {
    const allShapes = this.getAllShapes();
    allShapes.push(shape);
    localStorage.setItem(`shapes`, JSON.stringify(allShapes));
  }

  getAllShapes(): Shape[] {
    const allShapes = localStorage.getItem("shapes");
    if (!allShapes) return [];
    return JSON.parse(allShapes) as Shape[];
  }

  updateShape(shapeId: string, shape: Partial<Shape>) {
    const allShapes = this.getAllShapes();
    let wantToUpdate = allShapes.find((item) => item.id === shapeId);
    if (wantToUpdate) {
      // TODO: MAYBE A ERROR
      const filterdShapes = allShapes.filter(
        (item) => item.id !== wantToUpdate.id
      );
      const updatedShape = { ...wantToUpdate, ...shape } as Shape;

      console.log("this is the updted shape", updatedShape);
      filterdShapes.push(updatedShape);
      localStorage.setItem(`shapes`, JSON.stringify(filterdShapes));
    }
  }

  deleteShape(shapeId: string) {
    const allShapes = this.getAllShapes();
    const filterdShapes = allShapes.filter((item) => item.id !== shapeId);
    localStorage.setItem(`shapes`, JSON.stringify(filterdShapes));
  }
}

export const shapesStorage = new ShapesStorage();
