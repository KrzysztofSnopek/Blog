export const convertFile = (
  files: FileList | null,
  stringCodingPrefix: string
): string => {
  let starter = "";
  if (!files) {
    return "";
  }
  const fileRef = files[0] || "";
  const reader = new FileReader();
  reader.readAsBinaryString(fileRef);
  reader.onload = (e: any) => {
    starter = `${stringCodingPrefix}${e.target.result}`;
  };
  return starter;
};

export const addAndDivide = (
  number1: number,
  number2: number,
  number3: number
): number => {
  return (number1 + number2) / number3;
};
