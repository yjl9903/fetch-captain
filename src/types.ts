export interface User {
  /**
   * Captain uid
   */
  uid: number;

  /**
   * Captain username (at fetched time)
   */
  username: string;

  /**
   * Captain level: 3 for 舰长, 2 for 提督, 1 for 总督
   *
   * @default 3
   */
  level?: number;

  /**
   * Captain accompany length (number of days)
   */
  accompany?: number;
}
