import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

export const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-cream dark:bg-navy-dark py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-navy dark:text-cream mb-8 text-center">
          Prenota il tuo appuntamento
        </h1>

        <Card>
          <div className="space-y-6">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 1: Seleziona Servizio</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Scegli il servizio che desideri
                </p>
                <Button onClick={() => setStep(2)} className="mt-4">
                  Continua
                </Button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Step 2: Informazioni</h2>
                <div className="space-y-4">
                  <Input placeholder="Nome" />
                  <Input placeholder="Telefono" />
                  <Input placeholder="Email (opzionale)" type="email" />
                </div>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Indietro
                  </Button>
                  <Button onClick={() => setStep(3)}>Continua</Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

