

const WinnerTimer = async () => {
    return new Promise(async (resolve, reject) => {

        console.log("aguarde o winnerTimer!!! ")

        setTimeout(() => {
            console.log("continuando... ")
            resolve(true)
        }, 3000);

    })
}

export { WinnerTimer };