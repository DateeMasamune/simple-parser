import { FC } from "react";
import Alert from "@mui/material/Alert/Alert";

interface IProp {
  message?: string;
}

export const NetworkError: FC<IProp> = ({
  message = "Что-то пошло не так...",
}) => {
  return (
    <Alert severity="error">
      <h1>{message}</h1>
    </Alert>
  );
};
