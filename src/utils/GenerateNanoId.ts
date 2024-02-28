


function generateNanoId(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let nanoId = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        nanoId += characters[randomIndex];
    }
    return nanoId;
}


export default generateNanoId;