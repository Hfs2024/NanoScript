const catchStorageError = (fn, fallbackValue = false) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (e) {
            console.error(e);
            return fallbackValue;
        }
    };
};

NS.drafts = {
    createInstance: (instance) => {
        try {
            return localforage.createInstance({ name: instance });
        } catch (e) {
            console.error(e);
            return null;
        }
    },

    save: catchStorageError(async function save(branch, data, instance = localforage) {
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
        const data = await instance?.getItem(branch) || {};
        for (let key in data) {
            const obj = data[key];
            NS(NS(key)[obj.index]).setVal(obj.value);
        }
        return data;
    }, {}), 

    remove: catchStorageError(async function remove(branch, instance = localforage) {
        await instance?.removeItem(branch);
        return true;
    }, false),

    removeKey: catchStorageError(async function removeKey(branch, key, instance = localforage) {
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
        await localforage.dropInstance({ name: instance });
        return true;
    }, false)
};
