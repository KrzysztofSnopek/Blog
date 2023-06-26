import { convertFile, addAndDivide } from "./utils";

// describe("convertFile", () => {
//   test("creates base64 encoded file string", () => {
//     const file = {
//       0: {
//         lastModified: 1677540113170,
//         lastModifiedDate: {},
//         name: "3 do 2.PNG",
//         size: 93579,
//         type: "image/png",
//         webkitRelativePath: "",
//         item: "",
//       },
//       length: 1,
//     } as any;
//     const base64EncodingMethod = "btoa";

//     expect(convertFile(file, base64EncodingMethod)).toEqual("a");
//   });
// });

describe("addAndDivide", () => {
  test("works or not", () => {
    expect(addAndDivide(1, 2, 3)).toEqual(1);
  });

  test("works or not 2", () => {
    expect(addAndDivide(1, 2, 0)).toEqual(1);
  });
});
