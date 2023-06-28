export const convertFile = (files: FileList | null): string => {
  let starter = "";
  if (!files) {
    return "";
  }
  const fileRef = files[0] || "";
  console.log("ref: ", fileRef);
  const reader = new FileReader();
  reader.readAsBinaryString(fileRef);
  reader.onload = (e: any) => {
    starter = `${btoa(e.target.result)}`;
    console.log(starter);
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
