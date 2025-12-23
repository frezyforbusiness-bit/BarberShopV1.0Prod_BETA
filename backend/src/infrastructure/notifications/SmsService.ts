import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { INotificationService } from '../../application/ports/INotificationService';
import { Booking } from '../../domain/entities/Booking';

@Injectable()
export class SmsService implements INotificationService {
  private readonly twilioClient: twilio.Twilio | null = null;
  private readonly fromNumber: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    }

    this.fromNumber =
      this.configService.get<string>('TWILIO_PHONE_NUMBER') || '';
  }

  async sendBookingConfirmation(booking: Booking): Promise<void> {
    if (!this.twilioClient || !booking.customerPhone) {
      return;
    }

    const date = booking.timeSlot
      .getStartTime()
      .toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    const time = booking.timeSlot.toString();

    const message = `Conferma prenotazione: ${date} alle ${time}. Codice: ${booking.cancellationCode}`;

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: booking.customerPhone.getValue(),
      });
    } catch (error) {
      console.error('Failed to send confirmation SMS:', error);
    }
  }

  async sendBookingCancellation(booking: Booking): Promise<void> {
    if (!this.twilioClient || !booking.customerPhone) {
      return;
    }

    const message = 'La tua prenotazione è stata cancellata con successo.';

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: booking.customerPhone.getValue(),
      });
    } catch (error) {
      console.error('Failed to send cancellation SMS:', error);
    }
  }

  async sendBookingReminder(booking: Booking): Promise<void> {
    if (!this.twilioClient || !booking.customerPhone) {
      return;
    }

    const date = booking.timeSlot
      .getStartTime()
      .toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    const time = booking.timeSlot.toString();

    const message = `Promemoria: prenotazione domani ${date} alle ${time}. Ci vediamo presto!`;

    try {
      await this.twilioClient.messages.create({
        body: message,
        from: this.fromNumber,
        to: booking.customerPhone.getValue(),
      });
    } catch (error) {
      console.error('Failed to send reminder SMS:', error);
    }
  }
}

