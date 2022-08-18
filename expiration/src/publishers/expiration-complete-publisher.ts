import {
  BasePublisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@ticketing-ms-djay/common";

export class ExpirationCompletePublisher extends BasePublisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
