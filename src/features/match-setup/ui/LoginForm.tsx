import { useMemo, useState, type FormEvent } from "react";
import { normalizeName, validateName } from "../model/validators";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/shared/ui";

type LoginFormProps = {
  onSubmit: (session: { xName: string; oName: string }) => void;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [xName, setXName] = useState("");
  const [oName, setOName] = useState("");
  const [xTouched, setXTouched] = useState(false);
  const [oTouched, setOTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const normalizedX = useMemo(() => normalizeName(xName), [xName]);
  const normalizedO = useMemo(() => normalizeName(oName), [oName]);

  const baseXError = useMemo(() => validateName(xName), [xName]);
  const baseOError = useMemo(() => validateName(oName), [oName]);
  const sameError =
    !baseXError && !baseOError && normalizedX && normalizedX === normalizedO
      ? "Names must be different"
      : null;

  const xError = baseXError ?? sameError;
  const oError = baseOError ?? sameError;
  const canSubmit = !xError && !oError && normalizedX && normalizedO;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (!canSubmit) return;
    onSubmit({ xName: normalizedX, oName: normalizedO });
  };

  return (
    <Card className="w-full max-w-md shadow-xl shadow-slate-900/40">
      <CardHeader>
        <CardTitle>Start a new match</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="player-x">Player X</Label>
            <Input
              id="player-x"
              value={xName}
              placeholder="Enter name"
              onChange={(event) => setXName(event.target.value)}
              onBlur={() => setXTouched(true)}
            />
            {(xTouched || submitted) && xError ? (
              <p className="text-sm text-destructive">{xError}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="player-o">Player O</Label>
            <Input
              id="player-o"
              value={oName}
              placeholder="Enter name"
              onChange={(event) => setOName(event.target.value)}
              onBlur={() => setOTouched(true)}
            />
            {(oTouched || submitted) && oError ? (
              <p className="text-sm text-destructive">{oError}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={!canSubmit}>
            Start game
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
