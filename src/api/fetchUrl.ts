export const fetchUrl = async (sourceRef: string) => {
  const data = await fetch(sourceRef || "");
  const result = await data.arrayBuffer();
  const byteArray = new Uint8Array(result);
  const decodedText = new TextDecoder("windows-1251").decode(byteArray);

  return decodedText;
};
