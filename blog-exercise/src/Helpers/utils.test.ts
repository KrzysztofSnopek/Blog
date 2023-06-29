class MockFileReader {
  onload: ((event: any) => void) | null = null;

  readAsBinaryString(file: Blob): void {
    // Implement your desired behavior here
    const result = "Mock binary string"; // Replace with your mock result

    if (typeof this.onload === "function") {
      const event = { target: { result } };
      this.onload(event);
    }
  }
}

import { convertFile, addAndDivide } from "./utils";

describe("convertFile", () => {
  test("creates base64 encoded file string", async () => {
    (window as any).FileReader = MockFileReader;
    const file = {
      0: {
        lastModified: 1677540113170,
        lastModifiedDate: {},
        name: "3 do 2.PNG",
        size: 93579,
        type: "image/png",
        webkitRelativePath: "",
        item: "",
      },
      length: 1,
    } as any;

    const result = await convertFile(file);

    // Add your assertions here based on the expected result
    expect(result).toBe("TW9jayBiaW5hcnkgc3RyaW5n");
  });
});

// describe("addAndDivide", () => {
//   test("works or not", () => {
//     expect(addAndDivide(1, 2, 3)).toEqual(1);
//   });

//   test("works or not 2", () => {
//     expect(addAndDivide(1, 2, 0)).toEqual(1);
//   });
// });
