import { Context } from "egg";

export type ServerTimingOptions = {
  /**
   * The name of the total metric to be set.
   *
   * Total 名称
   *
   * @default "Total"
   */
  name: string;
  /**
   * The description of the total metric to be set.
   *
   * Total 描述
   *
   * @default "Total Response Time"
   */
  description: string;
  /**
   * Whether to set the total metric automatically.
   *
   * 是否启用 Total 统计
   *
   * @default true
   */
  total: boolean;
  /**
   * Whether to add ServerTiming header
   *
   * The function will be executed once when entering and exiting the middleware
   *
   * If the first execution returns false, the count function will be replaced with an empty function and will not be executed for the second time
   *
   * If the second execution returns false, the ServerTiming header will not be added to the header
   *
   * 是否添加 ServerTiming 头
   *
   * 函数将在进入和退出中间件的时候分别执行一次
   *
   * 第一次执行如果返回 false 则计数函数将使用空函数代替 此时并不会执行第二次
   *
   * 第二次执行如果返回 false 则不会在头部添加 ServerTiming 头
   *
   * @default true
   */
  enabled: boolean | ((ctx: Context) => boolean | Promise<boolean>);
  /**
   * Whether to set the metric automatically when the request ends.
   *
   * 是否在请求结束的时候自动结束并添加所有未结束的标签
   *
   * @default true
   */
  autoEnd: boolean;
  /**
   * Number of digits after the decimal point of the statistical time
   *
   * 统计时间的小数点后的位数
   *
   * @default +Infinity
   */
  precision: number;
};

const defaultOptions: ServerTimingOptions = {
  name: "Total",
  description: "Total Response Time",
  total: true,
  enabled: true,
  autoEnd: true,
  precision: +Infinity,
};

export default {
  serverTiming: defaultOptions,
};
