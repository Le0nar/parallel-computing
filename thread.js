const { workerData, parentPort } = require('worker_threads')
const R = require('./constants');

function counter(deep, sum, target) {
    if (deep === 1) {
        return Math.min(target - sum, 9) - Math.max(0, target - sum - 9) + 1;
    }
    else {
        let count = 0;
        for (let a = Math.max(0, target - sum - 9 * deep); a <= Math.min(target - sum, 9); a++) {
            count += counter(deep - 1, sum + a, target);
        }
        return count;
    }
}

let count = 0;

for (let i = 0; i < workerData.length; i++) {
    count += Math.pow(counter(R - 1, 0, workerData[i]), 2);
}

parentPort.postMessage(count);
