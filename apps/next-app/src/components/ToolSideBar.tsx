import { Shape, toolType } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";

interface ToolSideBarProps {
  selectedTool: toolType;
  setShapesDetails: Dispatch<SetStateAction<Shape>>;
}

export const ToolSideBar = ({
  selectedTool,
  setShapesDetails,
}: ToolSideBarProps) => {
  const softerBackgrounds = [
    "#000",
    "#e03131",
    "#2f9e44",
    "#F9E2AF",
    "#FECACA",
    "#E9D5FF",
  ];

  const backroundColors = [
    "",
    "#e0313188",
    "#2f9e4488",
    "#1971c288",
    "#f08c0088",
  ];
  const strokeColors = ["#fff", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];

  const colorPalette = softerBackgrounds;

  return (
    <div
      className="absolute left-5 top-1/2 -translate-y-1/2 dark:text-neutral-200 text-neutral-700 
      dark:bg-[#232329] bg-[#ececf8] p-5 rounded-xl shadow-lg
      flex flex-col justify-start items-start w-60 h-[550px] gap-5 border border-neutral-700/10 dark:border-neutral-600/20"
    >
      {/* Background Color */}
      {selectedTool !== "text" && selectedTool !== "pencil" && (
        <section className="flex flex-col w-full gap-2">
          <p className="text-sm font-medium capitalize opacity-80">
            Background color
          </p>
          <div className="flex flex-wrap gap-2">
            {backroundColors.map((item) => (
              <button
                title={item === "" ? "transparent" : item}
                key={item}
                onClick={() =>
                  setShapesDetails((p) => ({ ...p, bgColor: item }))
                }
                style={{ backgroundColor: item === "" ? "transparent" : item }}
                className="cursor-pointer hover:scale-[1.1] transition-transform rounded-md h-6 w-6 border border-neutral-400/30"
              />
            ))}
          </div>
        </section>
      )}

      {/* Stroke Color */}
      <section className="flex flex-col w-full gap-2">
        <p className="text-sm font-medium capitalize opacity-80">
          {selectedTool === "text" ? "Font" : "Stroke"} color
        </p>
        <div className="flex flex-wrap gap-2">
          {strokeColors.map((item) => (
            <button
              key={item}
              style={{ backgroundColor: item }}
              className="cursor-pointer hover:scale-[1.1] transition-transform rounded-md h-6 w-6 border border-neutral-400/30"
            />
          ))}
        </div>
      </section>

      {/* Stroke Width */}
      {selectedTool !== "text" && (
        <section className="flex flex-col w-full gap-2">
          <p className="text-sm font-medium capitalize opacity-80">
            Stroke width
          </p>
          <div className="flex justify-start items-center gap-2">
            {["2", "4", "6"].map((item) => (
              <button
                key={item}
                // onClick={() => setStrokeWidth(Number(item))}
                className="cursor-pointer hover:scale-[1.1] transition-transform rounded-md px-3 py-1.5 
              text-sm border dark:border-neutral-500 border-neutral-400/70 bg-neutral-100 dark:bg-neutral-800"
              >
                {item + " px"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Font Size */}
      {selectedTool === "text" && (
        <section className="flex flex-col w-full gap-2">
          <p className="text-sm font-medium capitalize opacity-80">Font Size</p>
          <div className="flex justify-start items-center gap-2">
            {["2", "4", "6"].map((item) => (
              <button
                key={item}
                // onClick={() => setStrokeWidth(Number(item))}
                className="cursor-pointer hover:scale-[1.1] transition-transform rounded-md px-3 py-1.5 
              text-sm border dark:border-neutral-500 border-neutral-400/70 bg-neutral-100 dark:bg-neutral-800"
              >
                {item + " px"}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Stroke Style */}
      {selectedTool !== "pencil" && selectedTool !== "text" && (
        <section className="flex flex-col w-full gap-2">
          <p className="text-sm font-medium capitalize opacity-80">
            Stroke style
          </p>
          <div className="flex justify-start items-center gap-3">
            {["solid", "dashed", "dotted"].map((item) => (
              <button
                key={item}
                className="cursor-pointer hover:scale-[1.1] transition-transform rounded-md px-2 py-1 flex items-center gap-2 
              border dark:border-neutral-500 border-neutral-400/70 bg-neutral-100 dark:bg-neutral-800"
              >
                <span
                  className="w-8 h-0 border-b-2 inline-block"
                  style={{ borderStyle: item, borderColor: "currentColor" }}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Border Radius */}
      {selectedTool !== "circle" && selectedTool !== "text" && (
        <section className="flex flex-col w-full gap-2">
          <p className="text-sm font-medium capitalize opacity-80">
            Border Radius
          </p>
          <div className="flex justify-start items-center gap-3">
            {["4px", "8px", "12px"].map((item) => (
              <button
                key={item}
                style={{ borderRadius: item }}
                className="cursor-pointer hover:scale-[1.1] transition-transform 
                border dark:border-neutral-500 border-neutral-400/70 
                h-6 w-6 bg-neutral-100 dark:bg-neutral-800"
              />
            ))}
          </div>
        </section>
      )}

      {/* Opacity */}
      <section className="flex flex-col w-full gap-2">
        <p className="text-sm font-medium capitalize opacity-80">Opacity</p>
        <input
          type="range"
          max={100}
          min={0}
          value={50}
          className="w-full accent-neutral-600 dark:accent-neutral-300"
        />
      </section>
    </div>
  );
};
