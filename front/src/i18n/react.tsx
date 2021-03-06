import * as i18next from 'i18next';
import * as React from 'react';

import { bind } from '../util/bind';

// React Context for holding i18n translation function.
const { Provider, Consumer } = React.createContext<
  { i18n: i18next.i18n } | undefined
>(undefined);

export interface IPropI18nProvider {
  i18n: i18next.i18n;
}
export interface IStateI18nProvider {
  context: { i18n: i18next.i18n };
}
/**
 * Component which provides an i18n instance to contxet.
 */
export class I18nProvider extends React.PureComponent<
  IPropI18nProvider,
  IStateI18nProvider
> {
  // F**k React! https://github.com/facebook/react/issues/12523
  state = {} as any;
  static getDerivedStateFromProps(
    nextProps: IPropI18nProvider,
  ): IStateI18nProvider {
    return { context: { i18n: nextProps.i18n } };
  }
  public render() {
    return (
      <Provider value={this.state.context}>{this.props.children}</Provider>
    );
  }
  public componentDidMount() {
    const { i18n } = this.props;
    i18n.on('languageChanged', this.languageChangedHandler);
  }
  public componentDidUpdate(prevProps: IPropI18nProvider) {
    if (prevProps.i18n !== this.props.i18n) {
      prevProps.i18n.off('languageChanged', this.languageChangedHandler);
      this.props.i18n.on('languageChanged', this.languageChangedHandler);
    }
  }
  public componentWillUnmount() {
    const { i18n } = this.props;
    i18n.off('languageChanged', this.languageChangedHandler);
  }
  @bind
  protected languageChangedHandler(): void {
    this.setState({
      context: { i18n: this.props.i18n },
    });
  }
}

export interface IPropI18n {
  children: (t: i18next.TranslationFunction) => React.ReactNode;
  // Namespace selected for i18n instance.
  namespace?: string;
}

/**
 * Give render props a `t`.
 */
export class I18n extends React.PureComponent<IPropI18n, {}> {
  public render() {
    const { children, namespace } = this.props;

    return (
      <Consumer>
        {context => {
          if (context == null) {
            return null;
          }
          const { i18n } = context;
          const t =
            namespace != null
              ? i18n.getFixedT(i18n.language, namespace)
              : i18n.t.bind(i18n);
          return children(t);
        }}
      </Consumer>
    );
  }
}

export interface IPropI18nInterp {
  /**
   * Object passed to the interpolation routine.
   */
  children?: Record<string, React.ReactNode>;
  /**
   * namespace.
   */
  ns: string;
  /**
   * key string.
   */
  k: string;
}
export class I18nInterp extends React.PureComponent<IPropI18nInterp, {}> {
  public render() {
    return (
      <Consumer>
        {context =>
          context && <I18nInterpInner i18n={context.i18n} {...this.props} />
        }
      </Consumer>
    );
  }
}

export interface IPropI18nInterpInner {
  /**
   * Object passed to the interpolation routine.
   */
  children?: Record<string, React.ReactNode>;
  /**
   * i18n instance.
   */
  i18n: i18next.i18n;
  /**
   * namespace.
   */
  ns: string;
  /**
   * key string.
   */
  k: string;
}
export interface IStateI18nInterpInner {
  /**
   * resource strings.
   */
  resource: string[];
}
/**
 * Render given i18n key with JSX element interpolation support.
 */
export class I18nInterpInner extends React.PureComponent<
  IPropI18nInterpInner,
  IStateI18nInterpInner
> {
  constructor(props: IPropI18nInterpInner) {
    super(props);
    this.state = {
      resource: [],
    };
  }
  public render() {
    const c = this.props.children as
      | Record<string, React.ReactNode>
      | undefined;
    const res: Array<React.ReactNode> = [];
    let flg = false;
    let i = 0;
    for (const r of this.state.resource) {
      if (flg) {
        res.push(
          <React.Fragment key={`interp-${i}`}>
            {c != null ? c[r] : null}
          </React.Fragment>,
        );
      } else {
        res.push(r);
      }
      flg = !flg;
      i++;
    }
    return res;
  }
  public componentDidMount() {
    const { i18n } = this.props;
    i18n.on('languageChanged', this.languageChangedHandler);
  }
  public componentWillUnmount() {
    const { i18n } = this.props;
    i18n.off('languageChanged', this.languageChangedHandler);
  }
  @bind
  protected languageChangedHandler(): void {
    this.setState({
      resource: getResource(this.props),
    });
  }
  static getDerivedStateFromProps(nextProps: IPropI18nInterpInner) {
    return {
      resource: getResource(nextProps),
    };
  }
}
/**
 * Retrieve an i18n resource from props.
 */
function getResource(props: IPropI18nInterpInner): string[] {
  const { i18n, ns, k } = props;
  const res: string | undefined = i18n.getResource(i18n.language, ns, k);
  if (res == null) {
    // If that resource is undefined, return the key itself (same behavior as i18n).
    return [k];
  }
  // XXX it cannot handle custom options.
  const result: string[] = [];
  let r;
  const reg = /\{\{(\w+)\}\}/g;
  let last = 0;
  while ((r = reg.exec(res))) {
    result.push(res.substring(last, r.index));
    result.push(r[1]);
    last = reg.lastIndex;
  }
  result.push(res.slice(last));
  return result;
}
