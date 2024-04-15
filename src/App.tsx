import "./App.css";
import { Loader } from "./components/Loader/Loader";
import styles from "./App.module.scss";
import { EFetchState } from "./constants";
import { InputBlock } from "./components/InputBlock/InputBlock";
import { List } from "./components/List/List";
import { NetworkError } from "./components/NetworkError/NetworkError";
import { useParser } from "./hooks/useParser";
import Button from "@mui/material/Button/Button";
import TextField from "@mui/material/TextField/TextField";
import Typography from "@mui/material/Typography/Typography";
import { EInputKeys } from "./types";
import Alert from "@mui/material/Alert/Alert";
import Snackbar from "@mui/material/Snackbar/Snackbar";

function App() {
  const {
    stop,
    list,
    errors,
    register,
    onSubmit,
    loadState,
    handleSubmit,
    errorMessage,
    showSnackbar,
    handleCloseSnackbar,
    unregisterFieldSearchId,
  } = useParser();

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Не найден id родительского элемента, перепроверьте правильно ли
          установлено цифровое значение поиска родительского элемента, в таком
          случае якорь ссылка не будет работать
        </Alert>
      </Snackbar>
      <Typography variant="h1">Parser VK</Typography>
      <div>
        <TextField
          variant="filled"
          className={styles.sourceInput}
          type="text"
          placeholder="Сылка на источник"
          {...register(EInputKeys.sourceRef, {
            required: "Ссылка на источник не заполнена",
          })}
          error={!!errors[EInputKeys.sourceRef]?.message}
          label={errors[EInputKeys.sourceRef]?.message}
          fullWidth
        />
      </div>
      <InputBlock
        unregisterField={unregisterFieldSearchId}
        checkboxLabel="не использовать поиск ID элемента, для ссылки якоря"
        isCheckbox
        type="number"
        className={styles.emergeContainer}
        title="На сколько уровней нужно подняться что бы захватить айди элемента"
        {...register(EInputKeys.emerge, {
          setValueAs: (value) => {
            return Math.abs(+value);
          },
        })}
        error={!!errors[EInputKeys.emerge]?.message}
        label={errors[EInputKeys.emerge]?.message}
      />
      <InputBlock
        type="text"
        className={styles.emergeContainer}
        title="Введите название параметра страницы"
        {...register(EInputKeys.query)}
        error={!!errors[EInputKeys.query]?.message}
        label={errors[EInputKeys.query]?.message}
      />
      <InputBlock
        type="text"
        className={styles.emergeContainer}
        title="Введите название класса селектора, по которому будет добываться текст"
        {...register(EInputKeys.selectorName, {
          required:
            "Имя селектора класса, должно быть указано, иначе не получится получить текст",
          setValueAs: (value) => {
            const isClearSelector = value[0] !== ".";
            return isClearSelector ? `.${value}` : value;
          },
        })}
        error={!!errors[EInputKeys.selectorName]?.message}
        label={errors[EInputKeys.selectorName]?.message}
      />
      <InputBlock
        type="text"
        className={styles.emergeContainer}
        title="Введите ключевые слова через запятую, пример: ключи,машина,майка"
        {...register(EInputKeys.keyWords, {
          required: "Ключевые слова, являются обязательными",
          setValueAs: (value) => {
            return value.split(",");
          },
        })}
        error={!!errors[EInputKeys.keyWords]?.message}
        label={errors[EInputKeys.keyWords]?.message}
      />
      <Button variant="contained" type="submit">
        Начать
      </Button>
      {!!list.length && <List list={list} />}
      {loadState === EFetchState.pending && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
      <Button
        className={styles.stopButton}
        onClick={() => {
          stop.current = true;
        }}
        variant="contained"
      >
        Остановить
      </Button>
      {loadState === EFetchState.rejected && <NetworkError message={errorMessage} />}
    </form>
  );
}

export default App;
