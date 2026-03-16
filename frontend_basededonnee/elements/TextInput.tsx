import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const TextInput = ({ label, name, value, onChange, disabled = false }: TextInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-100 disabled:text-gray-400"
      />
    </div>
  );
};

export default TextInput;
