import React from 'react';

const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  className = '',
  minHeight = '40px',
}) => {
  return (
    <div className="p-2 flex flex-col gap-2 w-full max-w-xs">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        className={`
            bg-black
          w-full
          min-h-[${minHeight}]
          px-3
          py-2
          text-sm
          rounded-lg
          focus:border-blue-500
          focus:ring-1
          focus:ring-blue-500
          disabled:bg-gray-100
          disabled:text-gray-500
          resize-y
          outline-none
          transition-colors
          ${className}
        `}
      />
    </div>
  );
};

export default TextArea;