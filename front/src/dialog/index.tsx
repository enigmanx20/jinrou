import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  IMessageDialog,
  IConfirmDialog,
  IPlayerDialog,
  IIconSelectDialog,
  ISelectDialog,
  IKickDialog,
  IKickManageDialog,
} from './defs';

import { MessageDialog } from './components/message';
import { ConfirmDialog } from './components/confirm';
import { PlayerDialog } from './components/player';
import { IconSelectDialog } from './components/icon-select';
import { I18nProvider, getI18nFor } from '../i18n';
import { i18n } from 'i18next';
import { SelectDialog } from './components/select';
import { KickDialog, KickResult } from './components/kick';
import { KickManageResult, KickManageDialog } from './components/kick-manage';

/**
 * Show a message dialog.
 */
export function showMessageDialog(d: IMessageDialog): Promise<void> {
  return showDialog(null, (open, close) => {
    const dialog = <MessageDialog {...d} onClose={() => close(undefined)} />;

    open(dialog);
  });
}

/**
 * Show a confirmation dialog.
 */
export function showConfirmDialog(d: IConfirmDialog): Promise<boolean> {
  return showDialog(null, (open, close) => {
    const dialog = <ConfirmDialog {...d} onSelect={close} />;

    open(dialog);
  });
}

/**
 * Show a player information dialog.
 */
export function showPlayerDialog(
  d: IPlayerDialog,
): Promise<{
  name: string;
  icon: string | null;
} | null> {
  return showDialog(null, (open, close) => {
    const dialog = <PlayerDialog {...d} onSelect={close} />;
    open(dialog);
  });
}

/**
 * Show an icon select dialog.
 */
export async function showIconSelectDialog(
  d: IIconSelectDialog,
): Promise<string | null> {
  // get i18n instance with system language.
  const i18n = await getI18nFor();
  return showDialog<string | null>(i18n, (open, close) => {
    const dialog = <IconSelectDialog {...d} onSelect={close} />;
    open(dialog);
  });
}

/**
 * Show a select dialog.
 */
export function showSelectDialog(d: ISelectDialog): Promise<string | null> {
  return showDialog(null, (open, close) => {
    const dialog = <SelectDialog {...d} onSelect={close} />;
    open(dialog);
  });
}

/**
 * Show a kick dialog.
 */
export async function showKickDialog(
  d: IKickDialog,
): Promise<KickResult | null> {
  const i18n = await getI18nFor();
  return showDialog<KickResult | null>(i18n, (open, close) => {
    const dialog = <KickDialog {...d} onSelect={close} />;
    open(dialog);
  });
}

/**
 * Show a kick manager dialog.
 */
export async function showKickManageDialog(
  d: IKickManageDialog,
): Promise<KickManageResult | null> {
  const i18n = await getI18nFor();
  return showDialog<KickManageResult | null>(i18n, (open, close) => {
    const dialog = <KickManageDialog {...d} onSelect={close} />;
    open(dialog);
  });
}

/**
 * Inner function to show a dialog.
 */
function showDialog<T>(
  i18n: i18n | null,
  callback: (
    open: ((dialog: React.ReactElement<any>) => void),
    close: ((result: T) => void),
  ) => void,
): Promise<T> {
  return new Promise(resolve => {
    // Add an area for showing dialog.
    const area = document.createElement('div');
    document.body.appendChild(area);

    // show a dialog.
    const open = (dialog: React.ReactElement<any>) => {
      // Wrap a dialog with I18nProvider if i18n is provided.
      const dialogElm =
        i18n != null ? (
          <I18nProvider i18n={i18n}>{dialog}</I18nProvider>
        ) : (
          dialog
        );
      ReactDOM.render(dialogElm, area);
    };
    // clean up dialog.
    const close = (result: T) => {
      ReactDOM.unmountComponentAtNode(area);
      document.body.removeChild(area);
      resolve(result);
    };

    callback(open, close);
  });
}