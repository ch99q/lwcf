export namespace CLI {
  export interface Options {
    dir?: string;
  }
}

export namespace TypeScript {
  export interface Options {
    compilerOptions: {
      rootDir?: string;
      rootDirs?: string[];
      outDir?: string;
      target?: string;
      esModuleInterop?: boolean;
    };
  }
}

export interface Package {
  /**
   * The main field is a module ID that is the primary entry point to your program.
   */
  main?: string;
  bin?:
    | string
    | {
        [k: string]: any;
      };
  /**
   * Set the types property to point to your bundled declaration file
   */
  types?: string;
  /**
   * Note that the "typings" field is synonymous with "types", and could be used as well.
   */
  typings?: string;
  /**
   * Specify either a single file or an array of filenames to put in place for the man program to find.
   */
  directories?: {
    /**
     * If you specify a 'bin' directory, then all the files in that folder will be used as the 'bin' hash.
     */
    bin?: string;
    /**
     * Put markdown files in here. Eventually, these will be displayed nicely, maybe, someday.
     */
    doc?: string;
    /**
     * Put example scripts in here. Someday, it might be exposed in some clever way.
     */
    example?: string;
    /**
     * Tell people where the bulk of your library is. Nothing special is done with the lib folder in any way, but it's useful meta info.
     */
    lib?: string;
    /**
     * A folder that is full of man pages. Sugar to generate a 'man' array by walking the folder.
     */
    man?: string;
    test?: string;
    [k: string]: any;
  };
  /**
   * An ECMAScript module ID that is the primary entry point to your program.
   */
  module?: string;
}
