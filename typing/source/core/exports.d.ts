export import Map = JSX.ElementExportsMap;
/**
 * Export decorator.
 */
declare type ExportDecorator = (prototype: object, property: string, descriptor: PropertyDescriptor) => void;
/**
 * Decorates the member to be exported.
 * @param name Exported name.
 * @returns Returns the method export decorator.
 */
export declare function Export(name?: string): ExportDecorator;
/**
 * Get all exported members from the specified component class prototype.
 * @param prototype Class prototype.
 * @returns Returns all exported members.
 */
export declare function getAllMembers(instance: object): Map;
export {};
