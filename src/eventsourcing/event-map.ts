import { Type } from '@nestjs/common';

export class EventMap {
  private static readonly events: Record<string, any> = {};

  public static register(eventName: string, event: any) {
    // eslint-disable-next-line functional/immutable-data
    EventMap.events[eventName] = event;
  }

  public static resolve(eventName: string) {
    return EventMap.events[eventName];
  }
}
