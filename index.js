const { Worker } = require('worker_threads')
const { cpus } = require('os')
const R = require('./constants');

const runThread = (workerData) => {
    return new Promise((resolve) => {
        const worker = new Worker('./thread.js', { workerData });
        worker.on('message', resolve);
    })
}

const arr = Array.from(Array(9 * R + 1).keys());

console.time('time')

const coresLength = cpus().length

let startIndex = 0;
const step = Math.ceil(arr.length / coresLength)
let endIndex = step

const emptyList = new Array(coresLength).fill(null)

const promiseList = emptyList.map((_item, index) => {
    const result = runThread(arr.slice(startIndex, endIndex))
    startIndex = endIndex
    endIndex = endIndex + step

    if (index === emptyList.length - 1) {
        return runThread(arr.slice(startIndex))
    }

    return result;
})

Promise.all(promiseList).then(counts => {
    let count = 0;
    for (let i = 0; i < counts.length; i++) {
        count += counts[i];
    }
    console.log('value: ' + count);
    console.timeEnd('time');
});
