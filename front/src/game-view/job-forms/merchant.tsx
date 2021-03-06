import * as React from 'react';
import { FormContentProps } from './defs';

/**
 * Make a form for Merchant.
 */
export function makeMerchantForm({ t }: FormContentProps) {
  return (
    <>
      <p>{t('game_client_form:Merchant.description')}</p>
      <p>
        <select name="Merchant_kit">
          {['Diviner', 'Psychic', 'Guard'].map(name => (
            <option key={name} value={name}>
              {t(`game_client_form:Merchant.kit.${name}`)}
            </option>
          ))}
        </select>
      </p>
    </>
  );
}
