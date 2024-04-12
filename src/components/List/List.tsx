import { FC } from "react";
import styles from "./List.module.scss";
interface IProp {
  list: IList[];
}

export interface IList {
  id: string;
  ref: string;
  message: string;
}

export const List: FC<IProp> = ({ list }) => {
  return (
    <ul>
      {list.map(({ id, ref, message }) => (
        <a className={styles.link} key={id} href={ref} target="_blank">
          <li>{message}</li>
        </a>
      ))}
    </ul>
  );
};
