const path = require("path");
const fs = require("fs");
const { resolve } = path;

// 小程序自身支持 commonjs, 每一个page 和 component 都是一个entry
// 他们可以 share 同一个 chunk
// 所以需要获取所有的入口资源喂给 webpack 避免重复打包


const getAppJson = (baseDir = "") => {
  return JSON.parse(
    fs.readFileSync(resolve(baseDir, "./app.json"), "utf-8")
  );
};

function getEntries(baseDir = "") {
  const appJSON = getAppJson(baseDir);
  const entries = {
    app: path.resolve(baseDir, "app.js"),
  };

  // 添加主包页面
  for (const page of appJSON.pages || []) {
    entries[page] = path.relative(baseDir, `${page}.js`);
  }

  // 添加分包页面
  for (const subPackage of appJSON.subPackages || []) {
    for (const page of subPackage.pages || []) {
      const fullPath = path.join(subPackage.root, page);
      entries[fullPath] = path.relative(baseDir, `${fullPath}.js`);
    }
  }

  // 读取并记录每个入口对应的 JSON 文件中的 usingComponents
  for (const [entryName, entryPath] of Object.entries(entries)) {
    const jsonPath = entryPath.replace(/\.js$/, '.json');
    if (fs.existsSync(jsonPath)) {
      try {
        const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        if (jsonContent.usingComponents) {
          for (let [, componentPath] of Object.entries(jsonContent.usingComponents)) {
            // 处理相对路径的组件
            if (componentPath.startsWith('..') || componentPath.startsWith('./')) {
              const absoluteComponentPath = path.resolve(path.dirname(jsonPath), componentPath);
              componentPath = path.relative(baseDir, absoluteComponentPath);
            }
            const relativeComponentPath = path.relative(baseDir, componentPath);
            console.log("Component path:", relativeComponentPath);
            const jsPath = `${relativeComponentPath}.js`;
            if (!entries[relativeComponentPath]) {
              entries[relativeComponentPath] = jsPath;
            }
          }
        }
      } catch (error) {
        console.error(`Error reading JSON file for ${entryName}:`, error);
      }
    }
  }

  // entries[assetsChunkName] = generateAssetsEntries(entries);

  return entries;
}

module.exports = getEntries;
