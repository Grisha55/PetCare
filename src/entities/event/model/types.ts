export type EventType = 'vaccine' | 'medicine' | 'checkup';

export type Event = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  status: 'ok' | 'soon' | 'overdue';
};