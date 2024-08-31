import { Publisher, Subjects, TicketCreatedEvent } from '@abra10tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
