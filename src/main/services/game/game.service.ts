import { startup, shutdown} from "./core/index"


export function Game_test(){
   startup().catch(console.error);
}

export function Game_shutdown(){
    shutdown()
}