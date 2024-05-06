let originalWX = wx;
wx = new Proxy(
  {},
  {
    // [0]
    get(target, name) {
      if (name in originalWX) {
        let isSyncFunction = name.endsWith("Sync"); // 同步函数 [1]
        let isNotFunction = typeof originalWX[name] !== "function"; // 非函数 [2]

        if (isSyncFunction || isNotFunction) return originalWX[name];

        return function (obj) {
          if (typeof obj === "object") {
            // [3]
            let originalFail = function () {};

            if ("fail" in obj) {
              originalFail = obj.fail;
            }
            obj.fail = function () {
              // todo 上报数据到后端 [4]
              console.log("hijack success");
              originalFail();
            };
          }
          return originalWX[name](obj);
        };
      }
    },
  }
);
