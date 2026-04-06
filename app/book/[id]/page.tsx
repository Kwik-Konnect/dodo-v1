"use client";

import { use, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getProfessionalById } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  CheckCircle,
  CreditCard,
  Shield,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/currency";

interface PageProps {
  params: Promise<{ id: string }>;
}

function BookingContent({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const professional = getProfessionalById(id);
  
  const preselectedServiceId = searchParams.get("service");
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(
    professional?.services.find(s => s.id === preselectedServiceId) || null
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!professional) {
    notFound();
  }

  const availableTimes = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const serviceFee = selectedService ? Math.round(selectedService.price * 0.05) : 0;
  const totalPrice = selectedService ? selectedService.price + serviceFee : 0;

  const canProceedStep1 = selectedService !== null;
  const canProceedStep2 = selectedDate && selectedTime;
  const canProceedStep3 = customerInfo.name && customerInfo.email && customerInfo.phone;
  const canProceedStep4 = paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardName;

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mt-6 text-2xl font-bold text-foreground">
                Booking Confirmed!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Your booking with {professional.name} has been confirmed.
              </p>
              
              <div className="mt-8 rounded-xl bg-muted p-6 text-left">
                <h3 className="font-semibold text-foreground">Booking Details</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">
                      {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">
                A confirmation email has been sent to {customerInfo.email}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild className="rounded-full">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button variant="outline" asChild className="rounded-full">
                  <Link href="/browse">Browse More Professionals</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Book {professional.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{professional.title}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {["Select Service", "Choose Time", "Your Details", "Payment"].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  step > index + 1 ? "bg-primary text-primary-foreground" :
                  step === index + 1 ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {step > index + 1 ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
                <span className={cn(
                  "ml-2 hidden text-sm sm:block",
                  step >= index + 1 ? "text-foreground" : "text-muted-foreground"
                )}>
                  {label}
                </span>
                {index < 3 && (
                  <div className={cn(
                    "mx-4 h-0.5 w-8 sm:w-16",
                    step > index + 1 ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedService?.id || ""}
                    onValueChange={(value) => {
                      const service = professional.services.find(s => s.id === value);
                      setSelectedService(service || null);
                    }}
                    className="space-y-4"
                  >
                    {professional.services.map((service) => (
                      <div
                        key={service.id}
                        className={cn(
                          "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors",
                          selectedService?.id === service.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedService(service)}
                      >
                        <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={service.id} className="cursor-pointer">
                            <span className="font-semibold text-foreground">{service.name}</span>
                          </Label>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {service.description}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {service.duration}
                            </span>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-primary">{formatPrice(service.price)}</span>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    className="mt-6 w-full rounded-xl"
                    size="lg"
                    disabled={!canProceedStep1}
                    onClick={() => setStep(2)}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Choose Time */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Choose Date & Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Calendar */}
                    <div>
                      <Label className="mb-2 block">Select Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start rounded-xl text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <Label className="mb-2 block">Select Time</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className="rounded-lg"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={!canProceedStep2}
                      onClick={() => setStep(3)}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Your Details */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests or notes for the professional..."
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="min-h-24 rounded-xl"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => setStep(2)}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={!canProceedStep3}
                      onClick={() => setStep(4)}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Payment (Simulated Monime.io) */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Payment</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Secured by Monime
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Monime.io Branding */}
                  <div className="rounded-xl border border-border bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <span className="text-lg font-bold text-white">M</span>
                      </div>
                      <div>
                        <p className="font-semibold text-indigo-900">Monime Checkout</p>
                        <p className="text-xs text-indigo-700">Secure payment processing</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={paymentInfo.cardName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                            const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
                            setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                          }}
                          className="rounded-xl pr-12"
                        />
                        <CreditCard className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + "/" + value.slice(2);
                            }
                            setPaymentInfo({ ...paymentInfo, expiryDate: value });
                          }}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                            setPaymentInfo({ ...paymentInfo, cvv: value });
                          }}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-start gap-3 rounded-xl bg-muted p-4 text-sm">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <p className="text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your full card details.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl"
                      onClick={() => setStep(3)}
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 rounded-xl"
                      disabled={!canProceedStep4 || isProcessing}
                      onClick={handlePayment}
                    >
                      {isProcessing ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${formatPrice(totalPrice)}`
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Professional Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={professional.avatar}
                      alt={professional.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{professional.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {professional.rating} ({professional.reviewCount})
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Selected Service */}
                  {selectedService ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{selectedService.name}</span>
                        <span className="font-medium text-foreground">{formatPrice(selectedService.price)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {selectedService.duration}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No service selected</p>
                  )}

                  {/* Date & Time */}
                  {(selectedDate || selectedTime) && (
                    <>
                      <Separator />
                      <div className="space-y-2 text-sm">
                        {selectedDate && (
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                          </div>
                        )}
                        {selectedTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{selectedTime}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Pricing */}
                  {selectedService && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Service</span>
                          <span className="text-foreground">{formatPrice(selectedService.price)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Platform fee</span>
                          <span className="text-foreground">{formatPrice(serviceFee)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">Total</span>
                          <span className="text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage(props: PageProps) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <BookingContent {...props} />
    </Suspense>
  );
}
