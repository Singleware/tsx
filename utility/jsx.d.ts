/*!
 * Copyright (C) 2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */

/**
 * JSX namespace.
 */
declare namespace JSX {
  /**
   * Element class, child type.
   */
  type ElementClassChild = undefined | null | boolean | number | string | Element;

  /**
   * Element class, children type.
   */
  type ElementClassChildren = never | ElementClassChild | ElementClassChild[];

  /**
   * Element class, attributes type.
   */
  type ElementClassAttributes = {};

  /**
   * Element class, state type.
   */
  type ElementClassState = {};

  /**
   * Element class, constructor type.
   */
  type ElementClassConstructor<A extends ElementClassAttributes> = new (attributes: Readonly<A>) => ElementClass;

  /**
   * Element event, details type.
   */
  type ElementEventDetails = {};

  /**
   * Element event type.
   */
  type ElementEvent<D extends ElementEventDetails> = {
    /**
     * Event type.
     */
    readonly type: string;
    /**
     * Event source.
     */
    readonly source: Element | null;
    /**
     * Event details.
     */
    readonly details: D;
    /**
     * Determines whether the event propagation was stopped.
     */
    readonly stopped: boolean;
    /**
     * Stop event propagation.
     */
    stop(): void;
  };

  /**
   * Element event, callback type.
   */
  type ElementEventCallback<P extends ElementEventDetails> = (event: ElementEvent<P>) => void;

  /**
   * Element, exports map type.
   */
  type ElementExportsMap = {
    [name: string]: any;
  };

  /**
   * Element types.
   */
  type ElementTypes = 'text' | 'plain' | 'class';

  /**
   * Element, text parameters type.
   */
  type ElementTextParameters = {
    /**
     * Text content.
     */
    content: any;
  };

  /**
   * Element, plain names type.
   */
  type ElementPlainNames = keyof IntrinsicElements;

  /**
   * Element, plain attributes type.
   */
  type ElementPlainAttributes = IntrinsicElements;

  /**
   * Element, plain parameters type.
   */
  type ElementPlainParameters<A extends ElementClassAttributes> = {
    /**
     * Plain name.
     */
    name: ElementPlainNames;
    /**
     * Plain attributes.
     */
    attributes: Readonly<A>;
  };

  /**
   * Element, class parameters type.
   */
  type ElementClassParameters = {
    /**
     * Class name.
     */
    name: string;
    /**
     * Class type.
     */
    type: ElementClassConstructor<any>;
  };

  /**
   * Element parameters type.
   */
  type ElementParameters<A extends ElementClassAttributes> =
    | ElementTextParameters
    | ElementPlainParameters<A>
    | ElementClassParameters;

  /**
   * Element.
   */
  interface Element {
    /**
     * Get element type.
     */
    readonly type: ElementTypes;
    /**
     * Get element parameters.
     */
    readonly parameters: Readonly<ElementParameters<ElementClassAttributes>>;
    /**
     * Get element children.
     */
    readonly children: Readonly<Element[]>;
    /**
     * Get component exports.
     */
    readonly exports: ElementExportsMap;
    /**
     * Set itself to be recycled.
     * @param state Recycle state.
     */
    recycle(state: boolean): void;
    /**
     * Render any child which needs to be recycled.
     */
    render(): void;
  }

  /**
   * Element class.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#class-component
   */
  interface ElementClass {
    /**
     * Get component state.
     */
    readonly state: Readonly<ElementClassState>;
    /**
     * Get component attributes.
     */
    readonly attributes: Readonly<ElementClassAttributes>;
    /**
     * Get component children.
     */
    readonly children: Readonly<ElementClassChild[]>;
    /**
     * Get default component state.
     */
    readonly defaultState: ElementClassState;
    /**
     * Start receiving the specified event type in the given callback.
     * @param event Event type.
     * @param callback Event callback.
     */
    attach<D extends ElementEventDetails>(event: string, callback: ElementEventCallback<D>): void;
    /**
     * Stop receiving the specified event type in the given callback.
     * @param event Event type.
     * @param callback Event callback.
     */
    detach<D extends ElementEventDetails>(event: string, callback: ElementEventCallback<D>): void;
    /**
     * Notify a new event to all child components.
     * @param type Event type.
     * @param parameters Event parameters.
     * @returns Returns true when all children were notified, false otherwise.
     */
    notify<D extends ElementEventDetails>(type: string, parameters: D): boolean;
    /**
     * Update component state.
     * @param state New component state.
     * @param recycle Determines whether the new state will set the component to recycle. (Default is true)
     */
    update(state: Partial<ElementClassState>, recycle?: boolean): void;
    /**
     * Determines whether or not the component will be recycled.
     * @param oldState Old state.
     * @returns Returns true if the component should recycle, false otherwise.
     */
    canRecycle(oldState: ElementClassState): boolean;
    /**
     * Render all component elements.
     * @returns Returns the rendering results.
     */
    render(): Element | Element[];
  }

  /**
   * Element children attribute.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#children-type-checking
   */
  interface ElementChildrenAttribute {
    readonly children: ElementClassChildren;
  }

  /**
   * Element attributes property.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#attribute-type-checking
   */
  interface ElementAttributesProperty {
    readonly attributes: ElementClassAttributes;
  }

  /**
   * Intrinsic elements.
   * @see https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements
   */
  interface IntrinsicElements {
    a: any;
    abbr: any;
    address: any;
    area: any;
    article: any;
    aside: any;
    audio: any;
    b: any;
    base: any;
    bdi: any;
    bdo: any;
    blockquote: any;
    body: any;
    br: any;
    button: any;
    canvas: any;
    caption: any;
    cite: any;
    code: any;
    col: any;
    colgroup: any;
    data: any;
    datalist: any;
    dd: any;
    del: any;
    details: any;
    dfn: any;
    dialog: any;
    div: any;
    dl: any;
    dt: any;
    em: any;
    embed: any;
    fieldset: any;
    figcaption: any;
    figure: any;
    footer: any;
    form: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    head: any;
    header: any;
    hr: any;
    html: any;
    i: any;
    iframe: any;
    img: any;
    input: any;
    ins: any;
    kbd: any;
    label: any;
    legend: any;
    li: any;
    link: any;
    main: any;
    map: any;
    mark: any;
    meta: any;
    meter: any;
    nav: any;
    noscript: any;
    object: any;
    ol: any;
    optgroup: any;
    option: any;
    output: any;
    p: any;
    param: any;
    picture: any;
    pre: any;
    progress: any;
    q: any;
    rp: any;
    rt: any;
    ruby: any;
    s: any;
    samp: any;
    script: any;
    section: any;
    select: any;
    small: any;
    source: any;
    span: any;
    strong: any;
    style: any;
    sub: any;
    summary: any;
    sup: any;
    svg: any;
    table: any;
    tbody: any;
    td: any;
    template: any;
    textarea: any;
    tfoot: any;
    th: any;
    thead: any;
    time: any;
    title: any;
    tr: any;
    track: any;
    u: any;
    ul: any;
    var: any;
    video: any;
    wbr: any;
  }
}
