const catchStorageError = (fn, fallback = false) => {
    return async (...args) => {
        try {
            if (typeof fn !== "function") return fallback;
            return await fn(...args);
        } catch (e) {
            console.error(e);
            return fallback;
        }
    };
};

const isString = (str) => typeof str === "string" && str;

NS.drafts = {
    createInstance: (instance) => {
        try {
            if (!isString(instance)) return null;
            return localforage.createInstance({ name: instance });
        } catch (e) {
            console.error(e);
            return null;
        }
    },

    save: catchStorageError(async function save(branch, data, instance = localforage) {
        if (Object.prototype.toString.call(data) !== "[object Object]" || !isString(branch)) return false;
        const current = await instance?.getItem(branch) || {};
        for (const key in data) {
            const obj = data[key];
            const index = Number.isInteger(obj?.index) ? obj.index : 0;
            const value = obj?.value || "";
            const el = NS(key)[index];
            if (!el) continue;
            current[key] = { index: index, value: value };
        }
        await instance?.setItem(branch, current);
        return true;
    }, false),

    load: catchStorageError(async function load(branch, instance = localforage) {
        if (!isString(branch)) return {};
        const data = await instance?.getItem(branch) || {};
        for (let key in data) {
            const obj = data[key];
            NS(NS(key)[Number.isInteger(obj?.index) ? obj.index : 0]).setVal(obj?.value || "");
        }
        return data;
    }, {}), 

    remove: catchStorageError(async function remove(branch, instance = localforage) {
        if (!isString(branch)) return false;
        await instance?.removeItem(branch);
        return true;
    }, false),

    removeKey: catchStorageError(async function removeKey(branch, key, instance = localforage) {
        if (!isString(branch) || !isString(key)) return false;
        const data = await instance?.getItem(branch) || {};
        if (data[key]) delete data[key];
        await instance?.setItem(branch, data);
        return true;
    }, false),

    removeAll: catchStorageError(async function removeAll(instance = localforage) {
        await instance?.clear();
        return true;
    }, false),

    dropInstance: catchStorageError(async function dropInstance(instance) {
        if (!isString(instance)) return false;
        await localforage.dropInstance({ name: instance });
        return true;
    }, false)
};
