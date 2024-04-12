import { ChangeEvent, useCallback, useRef, useState } from "react";
import "./App.css";
import { parse } from "node-html-parser";
import { Loader } from "./components/Loader/Loader";
import styles from "./App.module.scss";
import { EFetchState } from "./constants";
import { InputBlock } from "./components/InputBlock/InputBlock";
import { IList, List } from "./components/List/List";
import { NetworkError } from "./components/NetworkError/NetworkError";

function App() {
  const page = useRef(1);
  const stop = useRef(false);
  const [emerge, setEmerge] = useState(3);
  const [list, setList] = useState<IList[]>([]);
  const [selectorName, setSelectorName] = useState("");
  const [keyWords, setKeyWords] = useState<string[]>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [sourceRef, setSourceRef] = useState<string | null>(null);
  const [loadState, setLoadState] = useState(EFetchState.initial);

  const setListData = useCallback(
    (texts, emerge: number, setList, sourceRef: string) => {
      for (const text of texts) {
        const isCoincidences = keyWords.some((word) =>
          text.textContent.toLowerCase().trim().includes(word)
        );

        if (isCoincidences) {
          let target = text;
          for (let i = 0; i <= emerge; i++) {
            target = target.parentNode;
          }
          setList((prevState) => [
            ...prevState.filter(({ id }) => id !== target?.id),
            {
              id: target?.id,
              ref: `${sourceRef}#${target?.id}`,
              message: text.textContent,
            },
          ]);
        }
      }
    },
    [keyWords]
  );

  const buildNextUrl = useCallback((sourceRef: string, query: string) => {
    const searchParamsIndex = sourceRef?.indexOf("?");
    const searchParams = new URLSearchParams(
      sourceRef?.slice(searchParamsIndex + 1)
    );
    const currentPage = searchParams.get(query) ?? 1;
    const nextPage = +currentPage + page.current;
    const newSourceRef = sourceRef.replace(
      `${query}=${currentPage}`,
      `${query}=${nextPage}`
    );
    page.current += 1;
    return newSourceRef;
  }, []);

  const fetchData = async (source: string | null) => {
    try {
      if (!sourceRef || stop.current) return;

      setLoadState(EFetchState.pending);

      const data = await fetch(source || "");
      const result = await data.text();
      const root = parse(result);
      const texts = root.querySelectorAll(selectorName);

      if (!texts.length) {
        return;
      }

      setListData(texts, emerge, setList, sourceRef);
      setLoadState(EFetchState.fulfilled);

      if (query) {
        const nextUrl = buildNextUrl(sourceRef, query);
        await fetchData(nextUrl);
      }
    } catch (err) {
      setLoadState(EFetchState.rejected);
    }
  };

  const handleChangeSourceRef = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setSourceRef(value);
  };

  const handleChangeEmerge = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setEmerge(Math.abs(+value));
  };

  const handleChangeQuery = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    setQuery(value);
  };

  const handleChangeSelector = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const isClearSelector = value[0] !== ".";
    setSelectorName(isClearSelector ? `.${value}` : value);
  };

  const handleChangeKeyWords = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const splitValue = value.split(",");
    setKeyWords(splitValue);
  };

  return (
    <div className={styles.container}>
      <h1>Parser</h1>
      <div>
        <input
          className={styles.sourceInput}
          name="source"
          type="text"
          placeholder="Сылка на источник"
          value={sourceRef || ""}
          onChange={handleChangeSourceRef}
        />
      </div>
      <InputBlock
        name="emerge"
        type="number"
        value={emerge}
        onChange={handleChangeEmerge}
        className={styles.emergeContainer}
        title="На сколько уровней нужно подняться что бы захватить айди элемента"
      />
      <InputBlock
        name="query"
        type="text"
        value={query || ""}
        onChange={handleChangeQuery}
        className={styles.emergeContainer}
        title="Введите название параметра страницы"
      />
      <InputBlock
        name="selectorName"
        type="text"
        value={selectorName || ""}
        onChange={handleChangeSelector}
        className={styles.emergeContainer}
        title="Введите название класса селектора, по которому будет добываться текст"
      />
      <InputBlock
        name="selectorName"
        type="text"
        value={keyWords || ""}
        onChange={handleChangeKeyWords}
        className={styles.emergeContainer}
        title="Введите ключевые слова через запятую, пример: ключи,машина,майка"
      />
      <button
        onClick={() => {
          stop.current = false;
          fetchData(sourceRef);
        }}
      >
        Начать
      </button>
      <List list={list} />
      {loadState === EFetchState.pending && (
        <div className={styles.loaderContainer}>
          <Loader />
        </div>
      )}
      <button
        className={styles.stopButton}
        onClick={() => {
          stop.current = true;
        }}
      >
        Остановить
      </button>
      {loadState === EFetchState.rejected && <NetworkError />}
    </div>
  );
}

export default App;
