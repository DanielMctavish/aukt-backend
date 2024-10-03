import { IEngineFloorStatus, FLOOR_STATUS } from "../IMainAukController";


// Criar uma instância local de auk_sockets fora da função para manter o estado
let auk_sockets: Partial<IEngineFloorStatus> = {}

const resetAukSockets = () => {
    clearInterval(auk_sockets.interval)
    auk_sockets = {};
};

const setAukSocket = (data: Partial<IEngineFloorStatus>): Promise<Partial<IEngineFloorStatus>> => {
    return new Promise((resolve) => {
        if (data.nextProductIndex !== undefined) {
            console.log("DENTRO DO setAukSocket (nextIndex): ", data.nextProductIndex);
            auk_sockets.nextProductIndex = data.nextProductIndex;
        }

        // Mescla o estado existente com o novo
        auk_sockets = {
            ...auk_sockets,  // Mantém os dados existentes
            ...data          // Atualiza com os novos dados
        };

        resolve(auk_sockets);
    });
};

const getAukSocket = () => {
    return auk_sockets
}

export { setAukSocket, resetAukSockets, auk_sockets, getAukSocket, FLOOR_STATUS }