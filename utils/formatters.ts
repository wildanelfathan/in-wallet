import { format } from 'date-fns';

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string or Date object
 * @param date Date string (ISO format) or Date object
 * @param style Format style: 'short', 'medium', 'long', or 'full'
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, style: 'short' | 'medium' | 'long' | 'full' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (style) {
    case 'short':
      return format(dateObj, 'MMM d, yyyy');
    case 'medium':
      return format(dateObj, 'MMM d, yyyy, h:mm a');
    case 'long':
      return format(dateObj, 'MMMM d, yyyy, h:mm:ss a');
    case 'full':
      return format(dateObj, 'EEEE, MMMM d, yyyy, h:mm:ss a');
    default:
      return format(dateObj, 'MMM d, yyyy, h:mm a');
  }
};

/**
 * Formats a phone number
 * @param phone Phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if we can't format
  return phone;
};

/**
 * Truncates text with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength - 3)}...`;
};

/**
 * Formats a file size
 * @param bytes Size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}; 

// Add formatTime function to format time from a Date object
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats a card number by masking all but the last 4 digits
 * @param cardNumber Card number string
 * @returns Formatted card number with asterisks
 */
export const formatCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 4) {
    return cardNumber;
  }
  
  const lastFour = cardNumber.slice(-4);
  const masked = '*'.repeat(Math.max(0, cardNumber.length - 4));
  return `${masked}${lastFour}`;
}; 