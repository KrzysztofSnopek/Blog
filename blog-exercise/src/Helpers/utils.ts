export const addAndDivide = (
  number1: number,
  number2: number,
  number3: number
): number => {
  return (number1 + number2) / number3;
};

export const convertFile = (files: FileList): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    if (!files) {
      resolve("");
    }
    const fileRef = files[0] || "";
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const starter = btoa(e.target.result);
      resolve(starter);
    };
    reader.onerror = (e: any) => {
      reject(e);
    };
    reader.readAsBinaryString(fileRef);
  });
};
