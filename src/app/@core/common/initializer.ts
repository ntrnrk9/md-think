export const initializeObject = <TTarget, TSource>(target: TTarget, source: TSource) => {
    if (target === undefined || source === undefined) {
        return;
    }
    Object.keys(source).forEach((key) => {
        target[key] = source[key];
    });
};

export const hasMatch = (left: Array<string>, right: Array<string>) => {
    const intersected = right.reduce((acc, curr) => {
        return [...acc, ...left.filter((item) => item.trim().toUpperCase() === curr.trim().toUpperCase())];
    }, []);
    return intersected.length > 0;
};

export const groupBy = (items, key) =>
    items.reduce(
        (result, item) => ({
            ...result,
            [item[key]]: [...(result[item[key]] || []), item]
        }),
        {}
    );

export class ObjectUtils {
    static removeEmptyProperties = <TSource>(source: TSource, removeEmpty: boolean = true, removeNull: boolean = true, removeFalse: boolean = true) => {
        if (source === undefined) {
            return;
        }
        Object.keys(source).forEach((key) => {
            if (removeNull && (source[key] === null || source[key] === undefined)) {
                delete source[key];
            }
            if (removeEmpty && source[key] === '') {
                delete source[key];
            }
            if (removeFalse && source[key] === false) {
                delete source[key];
            }
        });
    }

    static objectsAreSame(x, y) {
        let objectsAreSame = true;
        for (const propertyName in x) {
            if (x[propertyName] !== y[propertyName]) {
                objectsAreSame = false;
                break;
            }
        }
        return objectsAreSame;
    }

    static isArrayEqual(value, other) {
        // Get the value type
        const type = Object.prototype.toString.call(value);

        // If the two objects are not the same type, return false
        if (type !== Object.prototype.toString.call(other)) {
            return false;
        }

        // If items are not an object or array, return false
        if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
            return false;
        }

        // Compare the length of the length of the two items
        const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) {
            return false;
        }

        // Compare two items
        const compare = function(item1, item2) {
            // Get the object type
            const itemType = Object.prototype.toString.call(item1);

            // If an object or array, compare recursively
            if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                if (!ObjectUtils.isArrayEqual(item1, item2)) {
                    return false;
                }
            } else {
                // If the two items are not the same type, return false
                if (itemType !== Object.prototype.toString.call(item2)) {
                    return false;
                }

                // Else if it's a function, convert to a string and compare
                // Otherwise, just compare
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) {
                        return false;
                    }
                } else {
                    if (item1 !== item2) {
                        return false;
                    }
                }
            }
        };

        // Compare properties
        if (type === '[object Array]') {
            for (let i = 0; i < valueLen; i++) {
                if (compare(value[i], other[i]) === false) {
                    return false;
                }
            }
        } else {
            for (const key in value) {
                if (value.hasOwnProperty(key)) {
                    if (compare(value[key], other[key]) === false) {
                        return false;
                    }
                }
            }
        }

        // If nothing failed, return true
        return true;
    }

    static groupBy(array: any[], f: Function) {
        const groups = {};
        array.forEach((o) => {
            const group = JSON.stringify(f(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map((group) => {
            return groups[group];
        });
    }
}
