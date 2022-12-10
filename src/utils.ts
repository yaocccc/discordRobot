const exec = require('child_process').exec;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runCMD = (cmd: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        exec(cmd, function (error: any, stdout: any) {
            if (error) {
                reject(error);
            }
            resolve(stdout);
        });
    });
};

export { sleep, runCMD };
