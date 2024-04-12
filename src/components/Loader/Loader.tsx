import clsx from "clsx";
import styles from "./Loader.module.scss";
import { FC } from "react";

interface IProp {
  className?: string;
}

export const Loader: FC<IProp> = ({ className }) => {
  return <div className={clsx(styles.loader, className)} />;
};
