declare module 'dns-lookup' {
  import { MxRecord as DnsMxRecord } from 'dns';
  /// <reference types="node" />

  interface MxRecord extends DnsMxRecord {}

  function txt(
    hostname: string,
    callback: (
      err: NodeJS.ErrnoException | null,
      records: (string | string[])[]
    ) => void
  ): void;
  function mx(
    hostname: string,
    callback: (err: NodeJS.ErrnoException | null, records: MxRecord[]) => void
  ): void;

  export { txt, mx, MxRecord };
}
