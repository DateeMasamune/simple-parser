import styles from "./NetworkError.module.scss";

export const NetworkError = () => {
  return (
    <div className={styles.container}>
      <h1>Что-то пошло не так...</h1>
    </div>
  );
};
