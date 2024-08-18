const path = require('path');
const fs = require('fs').promises;
const glob = require('glob-promise');

// 小程序自身支持 commonjs, 每一个page 和 component 都是一个entry
// 他们可以 share 同一个 chunk
// 所以需要获取所有的入口资源喂给 webpack 避免重复打包


async function getEntries(baseDir) {
  const appJSONPath = path.resolve(baseDir, 'app.json');
  const appJSON = JSON.parse(await fs.readFile(appJSONPath, 'utf-8'));
  
  const entries = {
    app: path.resolve(baseDir, 'app.js')
  };

  // 添加主包页面
  for (const page of appJSON.pages || []) {
    entries[page] = path.resolve(baseDir, `${page}.js`);
  }

  // 添加分包页面
  for (const subPackage of appJSON.subPackages || []) {
    for (const page of subPackage.pages || []) {
      const fullPath = path.join(subPackage.root, page);
      entries[fullPath] = path.resolve(baseDir, `${fullPath}.js`);
    }
  }

  // 添加组件
  const componentFiles = await glob('**/*.json', { cwd: baseDir });
  for (const file of componentFiles) {
    const content = JSON.parse(await fs.readFile(path.resolve(baseDir, file), 'utf-8'));
    if (content.component) {
      const name = path.dirname(file);
      entries[name] = path.resolve(baseDir, `${name}.js`);
    }
  }

  return entries;
}

module.exports = { getEntries };