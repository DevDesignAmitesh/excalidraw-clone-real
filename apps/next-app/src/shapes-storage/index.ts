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

  deleteAllShapes() {
    localStorage.setItem(`shapes`, JSON.stringify([]));
  }

  updateShape(shapeId: string, shape: Partial<Shape>) {
    const allShapes = this.getAllShapes();
    const wantToUpdate = allShapes.find((item) => item.id === shapeId);
    if (wantToUpdate) {
      // TODO: MAYBE AN ERROR
      const filterdShapes = allShapes.filter(
        (item) => item.id !== wantToUpdate.id
      );
      const updatedShape = { ...wantToUpdate, ...shape } as Shape;

      filterdShapes.push(updatedShape);
      localStorage.setItem(`shapes`, JSON.stringify(filterdShapes));
    }
  }

  getShape(shapeId: string) {
    const allShapes = this.getAllShapes();
    const wantToUpdate = allShapes.find((item) => item.id === shapeId);

    return wantToUpdate;
  }

  deleteShape(shapeId: string) {
    const allShapes = this.getAllShapes();
    const filterdShapes = allShapes.filter((item) => item.id !== shapeId);
    localStorage.setItem(`shapes`, JSON.stringify(filterdShapes));
  }
}

export const shapesStorage = new ShapesStorage();
