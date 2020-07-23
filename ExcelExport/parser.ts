interface IObj {
    columns: string[];
    data: object;
}


// turns an array of objects to an object of arrays with the corresponding keys

export const parseObject = (collObject: object[]): IObj => {
    // defining the columns / keys of the table
    const columns: string[] = collObject.reduce( (array: string[], obj) => [...array, ...Object.keys(obj).filter(key => !array.includes(key))] ,[]);
    // initializing an object from them
    let resp: object = {};
    columns.forEach(col => Object.defineProperty(resp, col, {value: [], writable: true, enumerable: true, configurable: true}));
    // adding the values to the object
    // collObject.forEach(obj => Object.keys(resp).forEach(column => resp[column].push(obj[column])  Object. ) )

    collObject.forEach(objectRow => {
        Object.keys(resp).forEach(key => {
            const respProperty = Object.entries(resp).find(touple => touple[0] === key) || [key, [null]]
            const respPrevVal = respProperty[1];
            const objectRowProperty = Object.entries(objectRow).find(touple => touple[0] === key) || [key, null]
            const objectRowVal = objectRowProperty[1];
            Object.defineProperty(resp, key, {
                enumerable: true,
                writable: true,
                configurable: true,
                value: [...respPrevVal, objectRowVal]
            })
        })
    })

    return {
        columns,
        data: resp
    }
}

