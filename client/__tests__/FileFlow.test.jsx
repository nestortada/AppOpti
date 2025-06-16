import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FileProvider } from '../src/context/FileContext';
import MinDaysInput from '../src/components/MinDaysInput.jsx';
import FileUploader from '../src/components/FileUploader.jsx';
describe('UI pieces', () => {
  it('renders upload button', () => {
    render(<FileProvider><FileUploader /></FileProvider>);
    expect(screen.getByText('Cargar archivo')).toBeInTheDocument();
  });

  it('validates min days regex', () => {
    const Wrapper = () => {
      const [v, setV] = useState('');
      return <FileProvider><MinDaysInput value={v} onChange={setV} /></FileProvider>;
    };
    render(<Wrapper />);
    const input = screen.getByPlaceholderText('Minimo de Asistencias');
    fireEvent.change(input, { target: { value: '0' } });
    expect(input.value).toBe('');
    fireEvent.change(input, { target: { value: '10' } });
    expect(input.value).toBe('10');
  });
});
