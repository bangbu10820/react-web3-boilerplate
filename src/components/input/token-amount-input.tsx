import React, { useCallback, useEffect, useRef, useState } from "react";

interface TokenAmountInputProps {
  value: string;
  onChange: (value: string) => void;
  decimals?: number;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  value,
  onChange,
  decimals = 18,
  placeholder = "0.0",
  className = "",
  style = {},
  "aria-describedby": ariaDescribedby,
  "aria-label": ariaLabel,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const onChangeRef = useRef(onChange);

  // Update the ref whenever onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const validateAndFormatInput = useCallback(
    (inputValue: string): string => {
      // Convert comma to dot
      let formattedValue = inputValue.replace(/,/g, ".");

      // Remove any characters that are not digits or dots
      formattedValue = formattedValue.replace(/[^0-9.]/g, "");

      // Handle multiple dots - keep only the first one
      const dotIndex = formattedValue.indexOf(".");
      if (dotIndex !== -1) {
        const beforeDot = formattedValue.substring(0, dotIndex + 1);
        const afterDot = formattedValue
          .substring(dotIndex + 1)
          .replace(/\./g, "");
        formattedValue = beforeDot + afterDot;
      }

      // Limit decimal places based on token decimals
      if (formattedValue.includes(".")) {
        const [integerPart, decimalPart] = formattedValue.split(".");
        const limitedDecimalPart = decimalPart.substring(0, decimals);
        formattedValue = integerPart + "." + limitedDecimalPart;
      }

      // Don't allow starting with multiple zeros unless followed by a dot
      if (
        formattedValue.length > 1 &&
        formattedValue.startsWith("0") &&
        !formattedValue.startsWith("0.")
      ) {
        formattedValue = formattedValue.replace(/^0+/, "0");
        if (formattedValue !== "0" && !formattedValue.startsWith("0.")) {
          formattedValue = formattedValue.substring(1);
        }
      }

      return formattedValue;
    },
    [decimals]
  );

  useEffect(() => {
    // If the incoming value ends with ".0" and current display ends with ".",
    // keep the display as is (user is still typing)
    if (value.endsWith(".0") && displayValue.endsWith(".")) {
      // Don't update display value, keep showing "1." instead of "1.0"
      return;
    }

    // Validate and format the incoming value from external source
    const validatedValue = validateAndFormatInput(value);

    // Only update display value if it's different to avoid unnecessary state updates
    if (validatedValue !== displayValue) {
      setDisplayValue(validatedValue);
    }

    // If validation changed the value, notify parent
    if (validatedValue !== value) {
      const actualValue = validatedValue.endsWith(".")
        ? validatedValue + "0"
        : validatedValue;
      onChangeRef.current(actualValue);
    }
  }, [value, validateAndFormatInput]);

  // Memoized function to handle decimal truncation
  const handleDecimalTruncation = useCallback(() => {
    if (displayValue && displayValue.includes(".")) {
      const [integerPart, decimalPart] = displayValue.split(".");

      // If current decimal part is longer than new decimals limit
      if (decimalPart && decimalPart.length > decimals) {
        const truncatedDecimalPart = decimalPart.substring(0, decimals);
        const newDisplayValue = integerPart + "." + truncatedDecimalPart;

        setDisplayValue(newDisplayValue);

        // Handle the actual value for cases ending with "."
        const actualValue = newDisplayValue.endsWith(".")
          ? newDisplayValue + "0"
          : newDisplayValue;
        onChangeRef.current(actualValue);
      }
    }
  }, [displayValue, decimals]);

  // Effect to handle decimals change - revalidate current value
  useEffect(() => {
    handleDecimalTruncation();
  }, [decimals, handleDecimalTruncation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const validatedValue = validateAndFormatInput(inputValue);

    setDisplayValue(validatedValue);

    // If input ends with ".", convert to ".0" for the actual value
    const actualValue = validatedValue.endsWith(".")
      ? validatedValue + "0"
      : validatedValue;
    onChangeRef.current(actualValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter
    if (["Backspace", "Delete", "Tab", "Escape", "Enter"].includes(e.key)) {
      return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey && ["a", "c", "v", "x", "z"].includes(e.key.toLowerCase())) {
      return;
    }

    // Allow: home, end, left, right, down, up
    if (
      [
        "Home",
        "End",
        "ArrowLeft",
        "ArrowRight",
        "ArrowDown",
        "ArrowUp",
      ].includes(e.key)
    ) {
      return;
    }

    // Allow: numbers (0-9), dot, comma
    if (
      /^[0-9]$/.test(e.key) || // 0-9
      e.key === "." || // dot
      e.key === "," // comma
    ) {
      return;
    }

    // Prevent all other keys
    e.preventDefault();
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      value={displayValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      style={style}
      autoComplete="off"
      spellCheck={false}
    />
  );
};
