/**
 * Currency formatting utilities for Sierra Leone Leone (SLE/Le)
 */

export const formatCurrency = (amount: number): string => {
  return `Le ${amount.toLocaleString()}`;
};

export const formatCurrencySymbol = (): string => {
  return 'Le';
};

export const formatCurrencyWithSymbol = (amount: number): string => {
  return `${formatCurrencySymbol()} ${amount.toLocaleString()}`;
};

// For backward compatibility with existing code that might use $
export const formatPrice = (amount: number): string => {
  return formatCurrency(amount);
};
