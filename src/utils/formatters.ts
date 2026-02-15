/**
 * Formats a number as Colombian Pesos (COP).
 * Displays thousands separators and no decimal digits.
 * @param price - The price to format.
 * @returns The formatted price string (e.g., "$ 1.000.000").
 */
export const formatCurrency = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(price);
};

/**
 * Formats a date string or Date object to a localized string.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Truncates text to a specified maximum length and adds an ellipsis.
 * @param text - The text to truncate.
 * @param maxLength - The maximum length of the text.
 * @returns The truncated text.
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
};
