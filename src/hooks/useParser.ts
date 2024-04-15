import parse from "node-html-parser";
import { useRef, useState, useCallback } from "react";
import { IList } from "../components/List/List";
import { EFetchState } from "../constants";
import { IInput } from "../types";
import { useForm, SubmitHandler } from "react-hook-form";
import { fetchUrl } from "../api/fetchUrl";

export const useParser = () => {
  const page = useRef(1);
  const stop = useRef(false);
  const [list, setList] = useState<IList[]>([]);
  const [isSearchId, setIsSearchId] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [loadState, setLoadState] = useState(EFetchState.initial);

  const unregisterFieldSearchId = (isChecked: boolean) => {
    setIsSearchId(isChecked);
  };

  const handleCloseSnackbar = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IInput>();

  const onSubmit: SubmitHandler<IInput> = (data) => {
    const { emerge, keyWords, query, selectorName, sourceRef } = data;
    stop.current = false;
    fetchData(sourceRef, emerge, keyWords, query, selectorName);
  };

  const setListData = useCallback(
    (
      texts: HTMLElement[],
      emerge: number,
      setList,
      sourceRef: string | null,
      keyWords: string[]
    ) => {
      for (const text of texts) {
        const isCoincidences = keyWords.some((word) =>
          text?.textContent?.toLowerCase().trim().includes(word)
        );

        if (isCoincidences) {
          let parent = text;

          for (let i = 0; i <= emerge; i++) {
            parent = parent.parentNode as HTMLElement;
          }

          if (!parent?.id && !isSearchId) {
            setShowSnackbar(true);
          }

          setList((prevState) => [
            ...prevState.filter(({ message }) => message !== text.textContent),
            {
              id: parent?.id || text.textContent,
              ref: `${sourceRef}#${parent?.id}`,
              message: text.textContent,
            },
          ]);
        }
      }
    },
    [isSearchId]
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

  const fetchData = async (
    sourceRef: string,
    emerge: string,
    keyWords: string,
    query: string,
    selectorName: string
  ) => {
    try {
      if (!sourceRef || stop.current) return;

      setLoadState(EFetchState.pending);
      const decodedText = await fetchUrl(sourceRef);

      const root = parse(decodedText);
      const texts = root.querySelectorAll(selectorName);

      if (!texts.length) {
        throw Error(
          "Элементы не найдены, возможно не соотвествует имя селектора для поиска"
        );
      }

      setListData(texts, emerge, setList, sourceRef, keyWords);
      setLoadState(EFetchState.fulfilled);

      if (query) {
        const nextUrl = buildNextUrl(sourceRef, query);
        await fetchData(nextUrl, emerge, keyWords, query, selectorName);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message);
      setLoadState(EFetchState.rejected);
    }
  };

  return {
    stop,
    list,
    errors,
    register,
    onSubmit,
    loadState,
    errorMessage,
    showSnackbar,
    handleSubmit,
    handleCloseSnackbar,
    unregisterFieldSearchId,
  };
};
