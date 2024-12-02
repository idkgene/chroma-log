const fileNameCache = new WeakMap<Error, string>();
const stackLineRegex = /\((.*):\d+:\d+\)$/;

export function getFileName(): string {
  const error = new Error();
  let fileName = fileNameCache.get(error);
  
  if (!fileName) {
    const stack = error.stack;
    if (!stack) return "";
    
    const lines = stack.split("\n");
    if (lines.length < 4) return "";
    
    const callerLine = lines[3];
    if (!callerLine) return "";
    
    const match = callerLine.match(stackLineRegex);
    fileName = match ? `[${match[1]}] ` : "";
    fileNameCache.set(error, fileName);
  }
  
  return fileName;
}
