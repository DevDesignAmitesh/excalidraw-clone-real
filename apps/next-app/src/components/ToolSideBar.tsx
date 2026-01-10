import { Shape, strokeStyle, toolType } from "@/utils/types";

interface ToolSideBarProps {
  selectedTool: toolType;
  updateShape: (shape: Partial<Shape>) => void;
  shapesDetails: Shape;
}

export const ToolSideBar = ({
  selectedTool,
  updateShape,
}: ToolSideBarProps) => {
  const strokeColors = ["#e03131", "#2f9e44", "#1971c2", "#f08c00"];
  const backgroundColors = ["#ffd6d6", "#d3f9d8", "#d0ebff", "#fff3bf"];

  return (
    <div
      className="absolute left-5 top-1/2 -translate-y-1/2
      w-56 h-auto rounded-2xl
      bg-white text-neutral-700
      dark:bg-[#1f1f26] dark:text-neutral-200
      shadow-lg dark:shadow-xl
      border border-neutral-200 dark:border-neutral-700/40
      flex flex-col gap-4 p-4"
    >
      {/* -------- Stroke -------- */}
      <Section title="Stroke">
        <div className="flex gap-2 flex-wrap">
          {strokeColors.map((c) => (
            <ColorBtn
              onClick={() => updateShape({ strokeColor: c })}
              key={c}
              color={c}
            />
          ))}
        </div>
      </Section>

      {/* -------- Background -------- */}
      {selectedTool !== "text" && selectedTool !== "pencil" && (
        <Section title="Background">
          <div className="flex gap-2 flex-wrap">
            {backgroundColors.map((c, i) => (
              <ColorBtn
                onClick={() => updateShape({ bgColor: c })}
                key={i}
                color={c}
              />
            ))}
          </div>
        </Section>
      )}

      {/* -------- Stroke width -------- */}
      {selectedTool !== "text" && (
        <Section title="Stroke width">
          <div className="flex gap-3">
            {[2, 4, 6].map((w) => (
              <IconBtn key={w}>
                <div
                  className="w-6 rounded-full
                  bg-neutral-900 dark:bg-neutral-100"
                  style={{ height: w / 2 }}
                />
              </IconBtn>
            ))}
          </div>
        </Section>
      )}

      {/* -------- Stroke style -------- */}
      {selectedTool !== "pencil" && selectedTool !== "text" && (
        <Section title="Stroke style">
          <div className="flex gap-3">
            {["line", "dashed", "dotted"].map((s) => (
              <IconBtn key={s}>
                <span
                  onClick={() => updateShape({ strokeStyle: s as strokeStyle })}
                  className="w-8 border-b-2
                  border-neutral-900 dark:border-neutral-100"
                  style={{ borderStyle: s === "line" ? "solid" : s }}
                />
              </IconBtn>
            ))}
          </div>
        </Section>
      )}

      {/* -------- Edges -------- */}
      {selectedTool !== "circle" && selectedTool !== "text" && (
        <Section title="Edges">
          <div className="flex gap-3">
            {[4, 8].map((r) => (
              <IconBtn key={r}>
                <div
                  onClick={() => updateShape({ borderRadius: r })}
                  className="h-6 w-6
                  border border-neutral-400 dark:border-neutral-400"
                  style={{ borderRadius: r }}
                />
              </IconBtn>
            ))}
          </div>
        </Section>
      )}

      {/* -------- Opacity -------- */}
      <Section title="Opacity">
        <div className="flex flex-col gap-1">
          <input
            onChange={(e) => updateShape({ opacity: Number(e.target.value) })}
            type="range"
            min={0}
            max={100}
            defaultValue={50}
            className="w-full accent-neutral-700 dark:accent-neutral-300"
          />
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      </Section>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="flex flex-col gap-2">
    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
      {title}
    </p>
    {children}
  </section>
);

const ColorBtn = ({
  color,
  onClick,
}: {
  color: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="h-6 w-6 rounded-md
    border border-neutral-300 dark:border-neutral-500/40
    hover:scale-110 transition-transform"
    style={{
      background: color,
    }}
    title={color}
  />
);

const IconBtn = ({ children }: { children: React.ReactNode }) => (
  <button
    className="h-8 w-8 rounded-lg px-1
    bg-neutral-100 hover:bg-neutral-200
    dark:bg-[#2b2b34] dark:hover:bg-[#34343f]
    flex items-center justify-center
    border border-neutral-200 dark:border-neutral-600/40"
  >
    {children}
  </button>
);
