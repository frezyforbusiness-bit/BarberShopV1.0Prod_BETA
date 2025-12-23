import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { INotificationService } from '../../application/ports/INotificationService';
import { Booking } from '../../domain/entities/Booking';

@Injectable()
export class EmailService implements INotificationService {
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (apiKey) {
      sgMail.setApiKey(apiKey);
    }
    this.fromEmail =
      this.configService.get<string>('SENDGRID_FROM_EMAIL') ||
      'noreply@barbershop.com';
  }

  async sendBookingConfirmation(booking: Booking): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey || !booking.customerEmail) {
      // Skip if no API key or no email
      return;
    }

    const msg = {
      to: booking.customerEmail.getValue(),
      from: this.fromEmail,
      subject: 'Conferma prenotazione',
      text: this.buildConfirmationText(booking),
      html: this.buildConfirmationHtml(booking),
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      // Log error but don't throw - notification failures shouldn't break the flow
      console.error('Failed to send confirmation email:', error);
    }
  }

  async sendBookingCancellation(booking: Booking): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey || !booking.customerEmail) {
      return;
    }

    const msg = {
      to: booking.customerEmail.getValue(),
      from: this.fromEmail,
      subject: 'Cancellazione prenotazione',
      text: this.buildCancellationText(booking),
      html: this.buildCancellationHtml(booking),
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send cancellation email:', error);
    }
  }

  async sendBookingReminder(booking: Booking): Promise<void> {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey || !booking.customerEmail) {
      return;
    }

    const msg = {
      to: booking.customerEmail.getValue(),
      from: this.fromEmail,
      subject: 'Promemoria prenotazione',
      text: this.buildReminderText(booking),
      html: this.buildReminderHtml(booking),
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Failed to send reminder email:', error);
    }
  }

  private buildConfirmationText(booking: Booking): string {
    const date = booking.timeSlot
      .getStartTime()
      .toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    const time = booking.timeSlot.toString();

    return `Ciao ${booking.customerName},

La tua prenotazione è stata confermata!

Data: ${date}
Ora: ${time}
Codice cancellazione: ${booking.cancellationCode}

Grazie per aver scelto il nostro servizio.`;
  }

  private buildConfirmationHtml(booking: Booking): string {
    const date = booking.timeSlot
      .getStartTime()
      .toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    const time = booking.timeSlot.toString();

    return `
      <h2>Conferma prenotazione</h2>
      <p>Ciao ${booking.customerName},</p>
      <p>La tua prenotazione è stata confermata!</p>
      <p><strong>Data:</strong> ${date}</p>
      <p><strong>Ora:</strong> ${time}</p>
      <p><strong>Codice cancellazione:</strong> ${booking.cancellationCode}</p>
      <p>Grazie per aver scelto il nostro servizio.</p>
    `;
  }

  private buildCancellationText(booking: Booking): string {
    return `Ciao ${booking.customerName},

La tua prenotazione è stata cancellata con successo.

Grazie.`;
  }

  private buildCancellationHtml(booking: Booking): string {
    return `
      <h2>Cancellazione prenotazione</h2>
      <p>Ciao ${booking.customerName},</p>
      <p>La tua prenotazione è stata cancellata con successo.</p>
      <p>Grazie.</p>
    `;
  }

  private buildReminderText(booking: Booking): string {
    const date = booking.timeSlot
      .getStartTime()
      .toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    const time = booking.timeSlot.toString();

    return `Ciao ${booking.customerName},

Ti ricordiamo la tua prenotazione domani!

Data: ${date}
Ora: ${time}

Ci vediamo presto!`;
  }

  private buildReminderHtml(booking: Booking): string {
    const date = booking.timeSlot
      .getStartTime()
      .toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    const time = booking.timeSlot.toString();

    return `
      <h2>Promemoria prenotazione</h2>
      <p>Ciao ${booking.customerName},</p>
      <p>Ti ricordiamo la tua prenotazione domani!</p>
      <p><strong>Data:</strong> ${date}</p>
      <p><strong>Ora:</strong> ${time}</p>
      <p>Ci vediamo presto!</p>
    `;
  }
}

