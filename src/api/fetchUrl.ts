export const fetchUrl = async (sourceRef: string) => {
  const data = await fetch(sourceRef || "");

  const contentType = data.headers.get("Content-Type")?.split(";") || [];
  const charset = contentType.find((type) => type.includes("charset"));
  
  if (charset) {
    const indexCharset = charset?.indexOf("=");
    const currentCharset = charset
      ?.slice(indexCharset + 1)
      ?.trim()
      ?.toLocaleLowerCase();

    const result = await data.arrayBuffer();
    const byteArray = new Uint8Array(result);
    const decodedText = new TextDecoder(currentCharset ?? "utf-8").decode(
      byteArray
    );

    return decodedText;
  }

  throw Error('Не удалось установить кодировку по заголовку ответа Content-Type страницы источника')
};
