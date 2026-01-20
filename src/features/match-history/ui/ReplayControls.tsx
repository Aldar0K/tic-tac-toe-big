import { Button, Slider } from "@/shared/ui";
import { clamp } from "@/shared/lib/clamp";

type ReplayControlsProps = {
  step: number;
  maxStep: number;
  onChangeStep: (next: number) => void;
};

export const ReplayControls = ({
  step,
  maxStep,
  onChangeStep,
}: ReplayControlsProps) => {
  const safeStep = clamp(step, 0, maxStep);

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChangeStep(0)}
          disabled={safeStep === 0}
        >
          ⏮
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChangeStep(safeStep - 1)}
          disabled={safeStep === 0}
        >
          ◀
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChangeStep(safeStep + 1)}
          disabled={safeStep === maxStep}
        >
          ▶
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChangeStep(maxStep)}
          disabled={safeStep === maxStep}
        >
          ⏭
        </Button>
      </div>

      <Slider
        min={0}
        max={maxStep}
        step={1}
        value={safeStep}
        onChange={(event) => onChangeStep(Number(event.currentTarget.value))}
      />

      <p className="text-center text-sm text-slate-400">
        Move: {safeStep} / {maxStep}
      </p>
    </div>
  );
};
