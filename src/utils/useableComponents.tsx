

interface LoadingSpinnerProps {
  message: string;
}



export const formatAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}

export function formatMarketCap(value: number) {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return value.toString();
  }
}

export function handleFormat(value: number | string): string {
  if (value === null || value === undefined || value === "") return "0";

  const num = typeof value === "string" ? Number(value) : value;

  if (isNaN(num)) return "0";

  return new Intl.NumberFormat("en-US").format(num);
}



export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => (
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
)

export const SkeletonLine = ({
  width = "100%",
  height = "16px",
  className = "",
}) => (
  <div
    className={`skeleton skeleton-rounded ${className}`}
    style={{ width, height }}
  />
);

const SkeletonAvatar = ({ size = "40px" }) => (
  <div
    className="skeleton skeleton-rounded-full"
    style={{ width: size, height: size }}
  />
);
export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-flex skeleton-space-x-3 skeleton-mb-3">
      <SkeletonAvatar size="50px" />
      <div className="skeleton-space-y-2 skeleton-flex-1">
        <SkeletonLine width="60%" height="20px" />
        <SkeletonLine width="40%" height="14px" />
      </div>
    </div>
    <div className="skeleton-space-y-3">
      <SkeletonLine width="100%" height="14px" />
      <SkeletonLine width="80%" height="14px" />
      <SkeletonLine width="90%" height="14px" />
    </div>
  </div>
);


/**
 * Formats token prices for display on frontend
 * Handles very small numbers (micro-caps) and larger numbers appropriately
 * Similar to how major exchanges like Binance, Uniswap, and DEXes display prices
 */
export function formatTokenPrice(price: number): string {
  if (!price || price === 0) return "$0.00";

  // For prices >= $1, show 2-4 decimal places
  if (price >= 1) {
    if (price >= 1000) {
      // For large prices, use compact notation
      return `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    // Between $1 and $1000, show up to 4 decimals
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })}`;
  }

  // For prices between $0.01 and $1
  if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  }

  // For very small prices (< $0.01), use scientific notation style
  // Count leading zeros after decimal point
  const priceStr = price.toString();
  const match = priceStr.match(/^0\.0*[1-9]/);

  if (match) {
    const leadingZeros = match[0].split('0').length - 2;

    if (leadingZeros >= 4) {
      // Show as $0.0{n}XXX format (like Uniswap/DEXScreener)
      // Example: $0.0{6}1234 means $0.0000001234
      const significantDigits = priceStr.replace(/^0\.0+/, '').substring(0, 4);
      return `$0.0{${leadingZeros}}${significantDigits}`;
    }
  }

  // For prices with 2-3 leading zeros, just show more decimals
  if (price >= 0.0001) {
    return `$${price.toFixed(6)}`;
  }

  // Fallback for extremely small prices
  return `$${price.toExponential(2)}`;
}

/**
 * Alternative simpler format - just shows significant figures
 */
export function formatTokenPriceSimple(price: number): string {
  if (!price || price === 0) return "$0.00";

  if (price >= 1) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })}`;
  }

  if (price >= 0.01) {
    return `$${price.toFixed(4)}`;
  }

  // For very small prices, show first 4 significant digits
  const significantDigits = price.toPrecision(4);
  return `$${significantDigits}`;
}

export function formatTimeAgo(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);
  const months = Math.floor(seconds / (86400 * 30));
  const years = Math.floor(seconds / (86400 * 365));

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}


export function timeAgo(dateString: string): string {
  const past = new Date(dateString);
  const now = new Date();

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = {
    yr: 31536000,
    m: 2592000,
    w: 604800,
    d: 86400,
    hr: 3600,
    min: 60,
    sec: 1,
  };

  for (const key in intervals) {
    const value = intervals[key as keyof typeof intervals];
    const amount = Math.floor(seconds / value);

    if (amount >= 1) {
      return amount === 1
        ? `${amount} ${key} ago`
        : `${amount} ${key}s ago`;
    }
  }

  return "just now";
}


export function formatNumber(num: number) {
  if (num === 0) return "0";

  const absNum = Math.abs(num);

  // Handle numbers >= 1
  if (absNum >= 1) {
    if (absNum >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2);
    }
    if (absNum >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) ;
    }
    if (absNum >= 1_000) {
      return (num / 1_000).toFixed(2) ;
    }
    return num.toFixed(2);
  }

  // Handle small decimals (< 1)
  // Count leading zeros after decimal point
  const str = absNum.toFixed(20);
  const decimalPart = str.split(".")[1];

  let leadingZeros = 0;
  for (const char of decimalPart) {
    if (char === "0") leadingZeros++;
    else break;
  }

  // If 4 or more leading zeros, use subscript notation: 0.0₅1234
  if (leadingZeros >= 4) {
    const significantDigits = decimalPart.slice(leadingZeros, leadingZeros + 4);
    const sign = num < 0 ? "-" : "";
    return `${sign}0.0₍${leadingZeros}₎${significantDigits}`;
  }

  // Otherwise just show reasonable precision, trim trailing zeros
  return parseFloat(num.toFixed(leadingZeros + 4)).toString();
}

