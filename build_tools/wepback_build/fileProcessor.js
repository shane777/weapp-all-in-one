import { resolve, join } from 'path';
import { readJson } from 'fs-extra';
import { parse } from 'path';
import { values } from 'lodash';

// 小程序自身支持 commonjs, 每一个page 和 component 都是一个entry
// 他们可以 share 同一个 chunk
// 所以需要获取所有的入口资源喂给 webpack 避免重复打包

// 获取入口资源
// base: 项目根目录
// 返回值: 入口资源数组


export async function getEntryResource(base) {
    const appJSONFile = resolve(base, 'app.json');
    const { pages = [], subPackages = [], tabBar = {} } = await readJson(
        appJSONFile
    );

    const components = new Set();
    for (const page of pages) {
        await getComponents(components, resolve(base, page));
    }

    for (const subPackage of subPackages) {
        const { root, pages = [] } = subPackage;

        await Promise.all(
            pages.map(async page =>
                getComponents(components, resolve(base, join(root, page)))
            )
        );
    }

    // getTabBarIcons(tabBar);  // TODO: Later

    return [
        'app',
        ...pages,
        ...[].concat(...subPackages.map(v => v.pages.map(w => join(v.root, w)))),
        ...components
    ];
}

// components: 组件集合
// instance: 页面json file 存在的路径
async function getComponents(components, instance) {
    const { usingComponents = {} } =
        (await readJson(`${instance}.json`).catch(
            err => err && err.code !== 'ENOENT' && console.error(err)
        )) || {};
    const componentBase = parse(instance).dir;
    for (const relativeComponent of values(usingComponents)) {
        if (relativeComponent.indexOf('plugin://') === 0) continue;
        const component = resolve(componentBase, relativeComponent);
        if (!components.has(component)) {
            components.add(relative(base, component));
            await getComponents(components, component);
        }
    }
}