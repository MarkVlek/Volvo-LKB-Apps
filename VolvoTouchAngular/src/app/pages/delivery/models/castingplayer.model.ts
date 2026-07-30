export class CastingPlayer {
    name: string;
    connectionId: string;
    connectedDate: string;
    state: State;
}

class State {
    contentName: string;
    isScreensaver: boolean;
    customerName: string;
    modelName: string;
    castingPlayer: string;
}