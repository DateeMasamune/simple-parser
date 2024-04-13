import Checkbox from "@mui/material/Checkbox/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel/FormControlLabel";
import TextField, { TextFieldProps } from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography/Typography";
import { forwardRef, useState } from "react";

type IProp = TextFieldProps & {
  title: string;
  isCheckbox?: boolean;
  checkboxLabel?: string;
  unregisterField?: (isChecked: boolean) => void;
};

export const InputBlock = forwardRef<HTMLInputElement, IProp>(
  (
    {
      unregisterField,
      isCheckbox = false,
      checkboxLabel,
      className,
      title,
      ...rest
    },
    ref
  ) => {
    const [checked, setChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      unregisterField?.(event.target.checked);
    };

    return (
      <div className={className}>
        <Typography>{title}</Typography>
        {isCheckbox && (
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label={checkboxLabel}
          />
        )}
        <TextField
          {...rest}
          ref={ref}
          fullWidth
          disabled={checked}
          variant="filled"
        />
      </div>
    );
  }
);
