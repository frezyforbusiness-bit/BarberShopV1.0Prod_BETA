import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-navy dark:text-cream mb-8">
          Dashboard Admin
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Prenotazioni Oggi</h3>
            <p className="text-3xl font-bold text-gold">0</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">Prenotazioni Settimana</h3>
            <p className="text-3xl font-bold text-gold">0</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-2">Fatturato</h3>
            <p className="text-3xl font-bold text-gold">€0</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-2xl font-semibold mb-4">Prenotazioni</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Nessuna prenotazione al momento
          </p>
        </Card>
      </div>
    </div>
  );
};


