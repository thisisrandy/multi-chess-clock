export interface Player {
  /**
   * The player's name
   */
  name: string;
  /**
   * The time taken in this player's most recent turn
   */
  timeLastTurn: number;
  /**
   * The cumulative time that it has been this player's turn this game, in
   * seconds
   */
  timePlayed: number;
  /**
   * Whether or not this player has exceeded their allotted play time
   */
  isOverTime: boolean;
}
