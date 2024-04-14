export const fetchUrl = async (sourceRef: string) => {
  const data = await fetch(sourceRef || "");

  const [, contentType] = data.headers.get("Content-Type")?.split(";") || [];
  const indexCharset = contentType?.indexOf("=");
  const currentCharset = contentType
    ?.slice(indexCharset + 1)
    ?.trim()
    .toLocaleLowerCase();

  const result = await data.arrayBuffer();
  const byteArray = new Uint8Array(result);
  const decodedText = new TextDecoder(currentCharset ?? "utf-8").decode(
    byteArray
  );

  return decodedText;
};
