import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  Euro,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { adminApi } from '../../../infrastructure/api/adminApi';
import type { BookingDTO } from '../../../application/dto/BookingDTO';
import { format, parseISO, isToday, isThisWeek } from 'date-fns';
import { it } from 'date-fns/locale';

export const AdminDashboardPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const queryClient = useQueryClient();

  // Fetch bookings for selected date
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', selectedDate],
    queryFn: () => adminApi.getDailyBookings(selectedDate),
  });

  // Complete booking mutation
  const completeBookingMutation = useMutation({
    mutationFn: adminApi.completeBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  // Filter bookings by status
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'ALL') return true;
    return booking.status === statusFilter;
  });

  // Calculate statistics
  const todayBookings = bookings.filter((b) => {
    const bookingDate = parseISO(b.date);
    return isToday(bookingDate);
  });

  const weekBookings = bookings.filter((b) => {
    const bookingDate = parseISO(b.date);
    return isThisWeek(bookingDate, { weekStartsOn: 1 });
  });

  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.servicePrice, 0);

  const confirmedToday = todayBookings.filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED').length;
  const pendingToday = todayBookings.filter((b) => b.status === 'PENDING').length;

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

  const getStatusBadge = (status: BookingDTO['status']) => {
    const variants = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const labels = {
      PENDING: 'In attesa',
      CONFIRMED: 'Confermata',
      COMPLETED: 'Completata',
      CANCELLED: 'Cancellata',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${variants[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const handleCompleteBooking = (bookingId: string) => {
    if (window.confirm('Segnare questa prenotazione come completata?')) {
      completeBookingMutation.mutate(bookingId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream-light to-white dark:from-navy-dark dark:via-navy dark:to-navy-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-display font-bold text-navy dark:text-cream mb-2">
            Dashboard Admin
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Gestisci le prenotazioni e monitora le performance
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Oggi</span>
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-cream mb-1">
                {confirmedToday}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prenotazioni confermate</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">In attesa</span>
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-cream mb-1">
                {pendingToday}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prenotazioni in attesa</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Settimana</span>
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-cream mb-1">
                {weekBookings.length}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prenotazioni questa settimana</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gold/20 rounded-lg">
                  <Euro className="w-6 h-6 text-gold" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Totale</span>
              </div>
              <h3 className="text-2xl font-bold text-navy dark:text-cream mb-1">
                {formatPrice(totalRevenue, 'EUR')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fatturato completato</p>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Date Selection */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-navy dark:text-cream mb-2">
                Seleziona data
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy text-gray-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold text-navy dark:text-cream mb-2">
                <Filter className="w-4 h-4 inline mr-1" />
                Filtra per stato
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy text-gray-900 dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                <option value="ALL">Tutti</option>
                <option value="PENDING">In attesa</option>
                <option value="CONFIRMED">Confermate</option>
                <option value="COMPLETED">Completate</option>
                <option value="CANCELLED">Cancellate</option>
              </select>
            </div>

            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['bookings'] })}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Aggiorna
            </Button>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card className="p-6">
          <h2 className="text-2xl font-display font-semibold text-navy dark:text-cream mb-6">
            Prenotazioni - {format(parseISO(selectedDate), "d MMMM yyyy", { locale: it })}
          </h2>

          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Nessuna prenotazione per questa data
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Servizio
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Barbiere
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Orario
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Prezzo
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Stato
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-navy dark:text-cream">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-navy-light/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-navy dark:text-cream">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.customerPhone}
                          </div>
                          {booking.customerEmail && (
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {booking.customerEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-navy dark:text-cream font-medium">
                          {booking.serviceName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.serviceDuration} min
                        </div>
                      </td>
                      <td className="py-4 px-4 text-navy dark:text-cream">
                        {booking.barberName}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-navy dark:text-cream">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gold">
                          {formatPrice(booking.servicePrice, booking.serviceCurrency)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="py-4 px-4">
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteBooking(booking.id)}
                            disabled={completeBookingMutation.isPending}
                          >
                            {completeBookingMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-1" />
                                Completa
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
