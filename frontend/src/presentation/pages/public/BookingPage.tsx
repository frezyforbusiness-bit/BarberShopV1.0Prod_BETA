import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Clock, User, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { shopApi, type Service, type Barber } from '../../../infrastructure/api/shopApi';
import { bookingApi } from '../../../infrastructure/api/bookingApi';
import type { TimeSlotDTO } from '../../../application/dto/BookingDTO';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Default shop slug - deve corrispondere a quello creato dallo script initDb
// Lo script initDb crea uno shop con slug 'barbershop'
const DEFAULT_SHOP_SLUG = 'barbershop';

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotDTO | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Get shop slug from URL or use default
  const shopSlug = new URLSearchParams(window.location.search).get('shop') || DEFAULT_SHOP_SLUG;

  // Fetch shop info to get shopId
  const { data: shop } = useQuery({
    queryKey: ['shop', shopSlug],
    queryFn: () => shopApi.getShopBySlug(shopSlug),
  });

  const shopId = shop?.id || shopSlug; // Fallback to slug if id not available

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services', shopSlug],
    queryFn: () => shopApi.getServices(shopSlug),
  });

  // Fetch barbers
  const { data: barbers = [], isLoading: barbersLoading } = useQuery({
    queryKey: ['barbers', shopSlug],
    queryFn: () => shopApi.getBarbers(shopSlug),
  });

  // Fetch available time slots
  const { data: timeSlots = [], isLoading: slotsLoading } = useQuery({
    queryKey: ['timeSlots', shopId, selectedBarber?.id, selectedService?.id, selectedDate],
    queryFn: () => {
      if (!selectedBarber || !selectedService || !selectedDate) return Promise.resolve([]);
      return bookingApi.getAvailableSlots(shopId, selectedBarber.id, selectedService.id, selectedDate, shopSlug);
    },
    enabled: !!selectedBarber && !!selectedService && !!selectedDate && !!shopId,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: (data: { bookingData: any; shopSlug: string }) =>
      bookingApi.create(data.bookingData, data.shopSlug),
    onSuccess: () => {
      setStep(5); // Success step
    },
  });

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setStep(3);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlotDTO) => {
    setSelectedTimeSlot(slot);
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedBarber || !selectedTimeSlot || !customerName || !customerPhone) {
      return;
    }

    const [startHour, startMinute] = selectedTimeSlot.startTime.split(':').map(Number);

    createBookingMutation.mutate({
      bookingData: {
        shopId: shopId,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        date: selectedDate,
        startHour,
        startMinute,
      },
      shopSlug: shopSlug,
    });
  };

  // Generate next 30 days for date selection
  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return format(date, 'yyyy-MM-dd');
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream-light to-white dark:from-navy-dark dark:via-navy dark:to-navy-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-navy dark:text-cream mb-2">
            Prenota il tuo appuntamento
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Scegli il servizio perfetto per te
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? 'bg-gold text-navy'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-16 transition-all ${
                      step > s ? 'bg-gold' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Scissors className="w-8 h-8 text-gold" />
                  <h2 className="text-3xl font-display font-semibold text-navy dark:text-cream">
                    Seleziona il servizio
                  </h2>
                </div>

                {servicesLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    Nessun servizio disponibile al momento
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services
                      .filter((s) => s.isActive)
                      .map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service)}
                          className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            selectedService?.id === service.id
                              ? 'border-gold bg-gold/10 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gold/50 bg-white dark:bg-navy-light'
                          }`}
                        >
                          <h3 className="text-xl font-semibold text-navy dark:text-cream mb-2">
                            {service.name}
                          </h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span>{service.durationMinutes} min</span>
                            </div>
                            <span className="text-lg font-bold text-gold">
                              {formatPrice(service.price, service.currency)}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Step 2: Select Barber */}
          {step === 2 && selectedService && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-8 h-8 text-gold" />
                  <h2 className="text-3xl font-display font-semibold text-navy dark:text-cream">
                    Scegli il tuo barbiere
                  </h2>
                </div>

                <div className="mb-4 p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Servizio selezionato:</span> {selectedService.name}
                  </p>
                </div>

                {barbersLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                  </div>
                ) : barbers.length === 0 ? (
                  <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                    Nessun barbiere disponibile al momento
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {barbers
                      .filter((b) => b.isActive)
                      .map((barber) => (
                        <button
                          key={barber.id}
                          onClick={() => handleBarberSelect(barber)}
                          className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            selectedBarber?.id === barber.id
                              ? 'border-gold bg-gold/10 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gold/50 bg-white dark:bg-navy-light'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                              <User className="w-8 h-8 text-gold" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-navy dark:text-cream">
                                {barber.name}
                              </h3>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Indietro
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && selectedService && selectedBarber && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-8 h-8 text-gold" />
                  <h2 className="text-3xl font-display font-semibold text-navy dark:text-cream">
                    Seleziona data e ora
                  </h2>
                </div>

                <div className="mb-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Servizio:</span> {selectedService.name} •{' '}
                    <span className="font-semibold">Barbiere:</span> {selectedBarber.name}
                  </p>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-navy dark:text-cream mb-3">
                    Seleziona la data
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {availableDates.map((date) => {
                      const dateObj = new Date(date);
                      const isToday = format(new Date(), 'yyyy-MM-dd') === date;
                      const isSelected = selectedDate === date;

                      return (
                        <button
                          key={date}
                          onClick={() => handleDateSelect(date)}
                          className={`p-3 rounded-lg border-2 transition-all hover:scale-[1.05] active:scale-[0.95] ${
                            isSelected
                              ? 'border-gold bg-gold text-navy font-semibold'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gold/50'
                          }`}
                        >
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {format(dateObj, 'EEE', { locale: it })}
                          </div>
                          <div className="text-lg font-semibold">
                            {format(dateObj, 'd')}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {format(dateObj, 'MMM', { locale: it })}
                          </div>
                              {isToday && (
                                <div className="text-xs text-gold mt-1">Oggi</div>
                              )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-cream mb-3">
                      Seleziona l'orario
                    </label>
                    {slotsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 text-gold animate-spin" />
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <p className="text-center text-gray-600 dark:text-gray-400 py-8">
                        Nessun orario disponibile per questa data
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={`${slot.startTime}-${slot.endTime}`}
                            onClick={() => handleTimeSlotSelect(slot)}
                            className={`p-3 rounded-lg border-2 transition-all hover:scale-[1.05] active:scale-[0.95] ${
                              selectedTimeSlot?.startTime === slot.startTime
                                ? 'border-gold bg-gold text-navy font-semibold'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gold/50'
                            }`}
                          >
                            {formatTime(slot.startTime)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Indietro
                  </Button>
                  <Button
                    onClick={() => setStep(4)}
                    disabled={!selectedDate || !selectedTimeSlot}
                    className="flex-1"
                  >
                    Continua
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Customer Information */}
          {step === 4 && selectedService && selectedBarber && selectedTimeSlot && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8">
                <h2 className="text-3xl font-display font-semibold text-navy dark:text-cream mb-6">
                  I tuoi dati
                </h2>

                <div className="mb-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-semibold">Servizio:</span> {selectedService.name}
                    </p>
                    <p>
                      <span className="font-semibold">Barbiere:</span> {selectedBarber.name}
                    </p>
                    <p>
                      <span className="font-semibold">Data:</span>{' '}
                      {format(new Date(selectedDate), "d MMMM yyyy", { locale: it })}
                    </p>
                    <p>
                      <span className="font-semibold">Orario:</span> {formatTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-cream mb-2">
                      Nome completo *
                    </label>
                    <Input
                      placeholder="Mario Rossi"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-cream mb-2">
                      Telefono *
                    </label>
                    <Input
                      type="tel"
                      placeholder="+39 123 456 7890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-navy dark:text-cream mb-2">
                      Email (opzionale)
                    </label>
                    <Input
                      type="email"
                      placeholder="mario.rossi@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                    Indietro
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!customerName || !customerPhone || createBookingMutation.isPending}
                    className="flex-1"
                  >
                    {createBookingMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Prenotazione in corso...
                      </>
                    ) : (
                      'Conferma prenotazione'
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle2 className="w-20 h-20 text-gold mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-display font-semibold text-navy dark:text-cream mb-4">
                  Prenotazione confermata!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Riceverai una conferma via SMS. Ti aspettiamo!
                </p>
                <Button onClick={() => window.location.reload()}>
                  Nuova prenotazione
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
