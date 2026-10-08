import { useCallback, useEffect, useState } from "react";
import { resultText, summaryText } from "@/application/converter/presentation/conversionText";
import { COPIED_FEEDBACK_MS, type NoticeText } from "@/application/converter/useCases";
import { useDeps } from "@/app/deps";
import {
  convert,
  DEFAULT_CONVERTER_FORM,
  noConversionReason,
  swapForm,
  type ConverterFormState,
  type NoConversionReason,
} from "@/domain/converter/conversion";
import { findConvertible, type Convertible } from "@/domain/converter/convertible";
import type { Result } from "@/domain/shared/result";

export interface ConverterForm extends ConverterFormState {
  /** La opción elegida en cada lado; `undefined` si su código no está en la lista. */
  from: Convertible | undefined;
  to: Convertible | undefined;
  /** Texto del campo "Resultado"; `""` si no hay conversión. */
  result: string;
  /** El resultado como número, sin redondear; `null` si no hay conversión. */
  resultValue: number | null;
  /** "{cantidad} {desde} = {resultado} {hacia}"; `null` si no hay conversión. */
  summary: string | null;
  /** Vacío del resultado: no hay nada que enseñar ni que copiar. */
  isResultEmpty: boolean;
  /** Por qué está vacío; `null` si hay resultado. */
  emptyReason: NoConversionReason | null;
  /** `true` durante 2 s después de copiar. */
  copied: boolean;
  setAmount: (amount: string) => void;
  setFromCode: (code: string) => void;
  setToCode: (code: string) => void;
  swap: () => void;
  /** Copia `result`. Si falla, el error es el aviso que hay que enseñar. */
  copy: () => Promise<Result<void, NoticeText>>;
}

/** Estado y acciones del formulario del convertidor sobre una lista de opciones. */
export function useConverterForm(options: readonly Convertible[]): ConverterForm {
  const { converter } = useDeps();
  const [form, setForm] = useState<ConverterFormState>(DEFAULT_CONVERTER_FORM);
  const [copied, setCopied] = useState(false);

  const from = findConvertible(options, form.fromCode);
  const to = findConvertible(options, form.toCode);
  // El resultado es un valor derivado: se recalcula solo al cambiar entrada o monedas.
  const conversion = convert(form.amount, from, to);
  const result = resultText(conversion);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const setAmount = useCallback((amount: string) => setForm((prev) => ({ ...prev, amount })), []);
  const setFromCode = useCallback(
    (fromCode: string) => setForm((prev) => ({ ...prev, fromCode })),
    [],
  );
  const setToCode = useCallback((toCode: string) => setForm((prev) => ({ ...prev, toCode })), []);

  const swap = () => setForm(swapForm(form, conversion));

  const copy = async () => {
    const outcome = await converter.copyResult(result);
    if (outcome.ok) setCopied(true);
    return outcome;
  };

  return {
    ...form,
    from,
    to,
    result,
    resultValue: conversion?.value ?? null,
    summary: summaryText(form, conversion),
    isResultEmpty: conversion === null,
    emptyReason: noConversionReason(form.amount, from, to),
    copied,
    setAmount,
    setFromCode,
    setToCode,
    swap,
    copy,
  };
}
