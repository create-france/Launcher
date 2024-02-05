export interface StringMap {
  [key: string]: string;
}

// simple toolkit to transfer object to form
// for example:
// { a: 'a', b: 'b' }
// will transferred into
// a=a&b=b
export function form(data: StringMap): string {
  const urlEncodedDataPairs: string[] = [];

  Object.keys(data).forEach((name) => {
    if (Object.prototype.hasOwnProperty.call(data, name)) {
      urlEncodedDataPairs.push(
        `${encodeURIComponent(name)}=${encodeURIComponent(data[name])}`,
      );
    }
  });

  return urlEncodedDataPairs.join('&').replace(/%20/g, '+');
}
