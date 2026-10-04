export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₦0';
  return '₦' + amount.toLocaleString('en-NG');
}

export function formatCompactNaira(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '');
    return `₦${val}B`;
  }
  if (amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return `₦${val}M`;
  }
  if (amount >= 1_000) {
    const val = (amount / 1_000).toFixed(0);
    return `₦${val}k`;
  }
  return formatNaira(amount);
}

export function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return isoDate;
  }
}

export function createWhatsAppLink(phone: string, propertyTitle: string, location: string): string {
  // Clean phone number: remove spaces, dashes, plus sign for api.whatsapp.com
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.slice(1);
  }
  const text = `Hello, I found your property on Gerald Property Hub and I am interested in the ${propertyTitle} listed in ${location}. Is it still available?`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export const LEGAL_DISCLAIMERS = {
  documentNotice: 'Document information supplied by listing owner/agent. Independent verification is recommended.',
  antiScamWarning: 'Never send money before independently confirming the property, seller and required documents.',
  verificationDisclaimer:
    'Gerald Property Hub clearly distinguishes between user-submitted information and platform-verified data. We do not claim a property is legally verified unless an actual verification process has been completed.'
};
