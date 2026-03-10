'use client';

import { useReducer, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

import { BookingState, BookingStep, VehicleSize, Service, Addon, CustomerForm } from '@/types';
import { getVehicleAdjustment } from '@/lib/utils';

import StepIndicator from './StepIndicator';
import BookingSummary from './BookingSummary';
import VehicleStep from './VehicleStep';
import ServiceStep from './ServiceStep';
import ExtrasStep from './ExtrasStep';
import DateTimeStep from './DateTimeStep';
import CustomerStep from './CustomerStep';
import ReviewStep from './ReviewStep';

// ─── State & Reducer ──────────────────────────────────────────────────────────

const initialState: BookingState = {
  step: 1,
  vehicleSize: null,
  service: null,
  selectedAddons: [],
  date: null,
  startTime: null,
  customer: {
    name: '',
    email: '',
    phone: '',
    carModel: '',
    licensePlate: '',
    notes: '',
  },
  totalPrice: 0,
  totalDuration: 0,
  vehicleAdjustment: 0,
};

type BookingAction =
  | { type: 'SET_VEHICLE'; payload: VehicleSize }
  | { type: 'SET_SERVICE'; payload: Service }
  | { type: 'TOGGLE_ADDON'; payload: Addon }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'SET_TIME'; payload: string }
  | { type: 'SET_CUSTOMER'; payload: Partial<CustomerForm> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_STEP'; payload: BookingStep };

function recalculate(state: BookingState): BookingState {
  if (!state.service) return { ...state, totalPrice: 0, totalDuration: 0 };

  const vehicleAdj = state.vehicleSize ? getVehicleAdjustment(state.vehicleSize) : 0;
  const addonsPrice = state.selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const addonsDuration = state.selectedAddons.reduce((sum, a) => sum + a.duration, 0);

  return {
    ...state,
    vehicleAdjustment: vehicleAdj,
    totalPrice: state.service.price + vehicleAdj + addonsPrice,
    totalDuration: state.service.duration + addonsDuration,
  };
}

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_VEHICLE': {
      const next = { ...state, vehicleSize: action.payload };
      return recalculate({ ...next, step: Math.max(state.step, 2) as BookingStep });
    }
    case 'SET_SERVICE': {
      const next = {
        ...state,
        service: action.payload,
        selectedAddons: [], // reset addons when service changes
        date: null,
        startTime: null,
        step: 3 as BookingStep,
      };
      return recalculate(next);
    }
    case 'TOGGLE_ADDON': {
      const exists = state.selectedAddons.some((a) => a.id === action.payload.id);
      const addons = exists
        ? state.selectedAddons.filter((a) => a.id !== action.payload.id)
        : [...state.selectedAddons, action.payload];
      return recalculate({ ...state, selectedAddons: addons });
    }
    case 'SET_DATE':
      return { ...state, date: action.payload, startTime: null };
    case 'SET_TIME':
      return { ...state, startTime: action.payload };
    case 'SET_CUSTOMER':
      return { ...state, customer: { ...state.customer, ...action.payload } };
    case 'NEXT_STEP':
      return { ...state, step: Math.min(6, state.step + 1) as BookingStep };
    case 'PREV_STEP':
      return { ...state, step: Math.max(1, state.step - 1) as BookingStep };
    case 'SET_STEP':
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface BookingWizardProps {
  services: Service[];
  addons: Addon[];
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingWizard({ services, addons }: BookingWizardProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const locale = useLocale();
  const router = useRouter();

  const handleSelectVehicle = useCallback((size: VehicleSize) => {
    dispatch({ type: 'SET_VEHICLE', payload: size });
  }, []);

  const handleSelectService = useCallback((service: Service) => {
    dispatch({ type: 'SET_SERVICE', payload: service });
  }, []);

  const handleToggleAddon = useCallback((addon: Addon) => {
    dispatch({ type: 'TOGGLE_ADDON', payload: addon });
  }, []);

  const handleSetDate = useCallback((date: string) => {
    dispatch({ type: 'SET_DATE', payload: date });
  }, []);

  const handleSetTime = useCallback((time: string) => {
    dispatch({ type: 'SET_TIME', payload: time });
  }, []);

  const handleSetCustomer = useCallback((data: Partial<CustomerForm>) => {
    dispatch({ type: 'SET_CUSTOMER', payload: data });
  }, []);

  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), []);
  const handleBack = useCallback(() => dispatch({ type: 'PREV_STEP' }), []);

  const handlePay = useCallback(async (captchaToken: string) => {
    if (!state.service || !state.vehicleSize || !state.date || !state.startTime) return;

    try {
      // 1. Create the pending booking
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleSize: state.vehicleSize,
          serviceId: state.service.id,
          addonIds: state.selectedAddons.map((a) => a.id),
          date: state.date,
          startTime: state.startTime,
          customer: state.customer,
          totalPrice: state.totalPrice,
          totalDuration: state.totalDuration,
          vehicleAdjustment: state.vehicleAdjustment,
          captchaToken,
        }),
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json();
        alert(err.error || 'Booking failed. Please try again.');
        return;
      }

      const { bookingId } = await bookingRes.json();

      // 2. Create Stripe checkout session
      const checkoutRes = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, locale }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.json();
        alert(err.error || 'Payment setup failed. Please try again.');
        return;
      }

      const { url } = await checkoutRes.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert('An unexpected error occurred. Please try again.');
    }
  }, [state, locale]);

  return (
    <div className="min-h-screen bg-white">
      {/* Progress */}
      <div className="border-b border-surface-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <StepIndicator currentStep={state.step} />
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content */}
          <div className="lg:col-span-2">
            {state.step === 1 && (
              <VehicleStep
                selectedSize={state.vehicleSize}
                onSelect={handleSelectVehicle}
              />
            )}
            {state.step === 2 && (
              <ServiceStep
                services={services}
                selectedServiceId={state.service?.id ?? null}
                vehicleSize={state.vehicleSize}
                onSelect={handleSelectService}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {state.step === 3 && (
              <ExtrasStep
                addons={addons}
                selectedAddonIds={state.selectedAddons.map((a) => a.id)}
                onToggle={handleToggleAddon}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {state.step === 4 && (
              <DateTimeStep
                totalDuration={state.totalDuration}
                selectedDate={state.date}
                selectedTime={state.startTime}
                onDateChange={handleSetDate}
                onTimeChange={handleSetTime}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {state.step === 5 && (
              <CustomerStep
                customer={state.customer}
                onChange={handleSetCustomer}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}
            {state.step === 6 && (
              <ReviewStep
                state={state}
                onPay={handlePay}
                onBack={handleBack}
              />
            )}
          </div>

          {/* Summary sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <BookingSummary state={state} />
            </div>
          </div>
        </div>

        {/* Mobile summary */}
        {state.step > 1 && (
          <div className="lg:hidden mt-8">
            <BookingSummary state={state} />
          </div>
        )}
      </div>
    </div>
  );
}
