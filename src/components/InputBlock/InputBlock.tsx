import { FC, InputHTMLAttributes } from "react";

interface IProp extends InputHTMLAttributes<HTMLInputElement> {
  title: string;
}
export const InputBlock: FC<IProp> = ({
  className,
  title,
  ...rest
}) => {
  return (
    <div className={className}>
      <p>{title}</p>
      <input {...rest} />
    </div>
  );
};
