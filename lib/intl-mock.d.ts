interface IntlParams {
  [key: string]: string | number | undefined;
}

export declare const intl: {
  t: (message: string, params?: IntlParams) => string;
}; 