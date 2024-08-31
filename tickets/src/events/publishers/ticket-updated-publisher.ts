import { Publisher, Subjects, TicketUpdatedEvent } from '@abra10tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
