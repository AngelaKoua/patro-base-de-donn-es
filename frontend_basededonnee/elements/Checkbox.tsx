import React from 'react';

interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ label, name, checked, onChange }: CheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-sky-500"
      />
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
