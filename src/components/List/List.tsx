import { FC } from "react";
import styles from "./List.module.scss";
import ListMui from "@mui/material/List";
import { Box, ListItem, ListItemButton, ListItemText } from "@mui/material";
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
    <Box sx={{ width: "100%"}} className={styles.link}>
      <ListMui>
        {list.map(({ id, ref, message }) => (
          <ListItem disablePadding key={id}>
            <ListItemButton component="a" href={ref} target="_blank">
              <ListItemText primary={message} />
            </ListItemButton>
          </ListItem>
        ))}
      </ListMui>
    </Box>
  );
};
