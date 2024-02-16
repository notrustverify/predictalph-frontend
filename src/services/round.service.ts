import {Game, GameType} from "../domain/game";
import {Round, RoundStatus} from "../domain/round";
import {Contract} from "../domain/contract";

export class RoundService {
    private readonly games = [
        new Game(
            "ALPHPRICE",
            "ALPH Price",
            new Contract(
                "8e4501267810166ab78f55b2cd87dac57fa2b7ab01b804e519bd7a0011c85301",
                "24GK2udXSwkjkD78xpBgZZNJpLbEaDEKrgsEeRNqwjVDi",
                1),
            ["BULL", "BEAR"],
            GameType.CHOICE
        )
    ];


}
