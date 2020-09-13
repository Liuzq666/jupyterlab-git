import { IChangedArgs } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { JSONObject, ReadonlyJSONObject, Token } from '@phosphor/coreutils';
import { IDisposable } from '@phosphor/disposable';
import { ISignal } from '@phosphor/signaling';

export const EXTENSION_ID = 'jupyter.extensions.git_plugin';

export const IGitExtension = new Token<IGitExtension>(EXTENSION_ID);

/** Interface for extension class */
export interface IGitExtension extends IDisposable {
  /**
   * The list of branch in the current repo
   */
  branches: Git.IBranch[];

  /**
   * The current branch
   */
  currentBranch: Git.IBranch;

  /**
   * A signal emitted when the `HEAD` of the Git repository changes.
   */
  readonly headChanged: ISignal<IGitExtension, void>;

  /**
   * A signal emitted whenever a model event occurs.
   */
  readonly logger: ISignal<IGitExtension, string>;

  /**
   * Top level path of the current Git repository
   */
  pathRepository: string | null;

  /**
   * A signal emitted when the current Git repository changes.
   */
  readonly repositoryChanged: ISignal<IGitExtension, IChangedArgs<string>>;

  /**
   * Test whether the model is ready;
   * i.e. if the top folder repository has been found.
   */
  isReady: boolean;

  /**
   * A promise that fulfills when the model is ready;
   * i.e. if the top folder repository has been found.
   */
  ready: Promise<void>;

  /**
   * Files list resulting of a Git status call.
   */
  readonly status: Git.IStatusFileResult[];

  /**
   * A signal emitted when the current status of the Git repository changes.
   */
  readonly statusChanged: ISignal<IGitExtension, Git.IStatusFileResult[]>;

  /**
   * Add one or more files to the repository staging area.
   *
   * ## Notes
   *
   * -   If no filename is provided, all files are added.
   *
   * @param filename - files to add
   * @returns promise which resolves upon adding files to the repository staging area
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  add(...filename: string[]): Promise<void>;

  /**
   * Add all "unstaged" files to the repository staging area.
   *
   * @returns promise which resolves upon adding files to the repository staging area
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  addAllUnstaged(): Promise<void>;

  /**
   * Add all untracked files to the repository staging area.
   *
   * @returns promise which resolves upon adding files to the repository staging area
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  addAllUntracked(): Promise<void>;

  /**
   * Add the file named fname to the current marker with given mark
   *
   * @param fname Filename
   * @param mark Mark to set
   */
  addMark(fname: string, mark: boolean): void;

  /**
   * Add a remote Git repository to the current repository.
   *
   * @param url - remote repository URL
   * @param name - remote name
   * @returns promise which resolves upon adding a remote
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  addRemote(url: string, name?: string): Promise<void>;

  /**
   * Retrieve the repository commit log.
   *
   * ## Notes
   *
   * -  This API can be used to implicitly check if the current folder is a Git repository.
   *
   * @param count - number of commits to retrieve
   * @returns promise which resolves upon retrieving the repository commit log
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  allHistory(historyCount?: number): Promise<Git.IAllHistory>;

  /**
   * Checkout a branch.
   *
   * ## Notes
   *
   * -   If a branch name is provided, checkout the provided branch (with or without creating it)
   * -   If a filename is provided, checkout the file, discarding all changes.
   * -   If nothing is provided, checkout all files, discarding all changes.
   *
   * TODO: Refactor into separate endpoints for each kind of checkout request
   *
   * @param options - checkout options
   * @returns promise which resolves upon performing a checkout
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  checkout(options?: Git.ICheckoutOptions): Promise<Git.ICheckoutResult>;

  /**
   * Make request to checkout the specified tag version
   *
   * @param tag of the version to checkout
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  checkoutTag(tag: string): Promise<Git.ICheckoutResult>;

  /**
   * Clone a repository.
   *
   * @param path - local path into which the repository will be cloned
   * @param url - Git repository URL
   * @param auth - remote repository authentication information
   * @returns promise which resolves upon cloning a repository
   *
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  clone(path: string, url: string, auth?: Git.IAuth): Promise<Git.ICloneResult>;

  /**
   * Commit all staged file changes.
   *
   * @param message - commit message
   * @returns promise which resolves upon committing file changes
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  commit(message: string): Promise<void>;

  /**
   * Get (or set) Git configuration options.
   *
   * @param options - configuration options to set
   * @returns promise which resolves upon either getting or setting configuration options
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  config(options?: JSONObject): Promise<JSONObject | void>;

  /**
   * Fetch commit information.
   *
   * @param hash - commit hash
   * @returns promise which resolves upon retrieving commit information
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  detailedLog(hash: string): Promise<Git.ISingleCommitFilePathInfo>;

  /**
   * Ensure a .gitignore file exists
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  ensureGitignore(): Promise<void>;

  /**
   * Get current mark of file named fname
   *
   * @param fname Filename
   * @returns Mark of the file
   */
  getMark(fname: string): boolean;

  /**
   * Gets the path of the file relative to the Jupyter server root.
   *
   * If no path is provided, returns the Git repository top folder relative path.
   * If no Git repository selected, return null
   *
   * @param path the file path relative to Git repository top folder
   * @returns Relative file path to the server root
   */
  getRelativeFilePath(path?: string): string | null;

  /**
   * Add an entry in .gitignore file
   *
   * @param filename The name of the entry to ignore
   * @param useExtension Ignore all files having the same extension as filename
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  ignore(filename: string, useExtension: boolean): Promise<void>;

  /**
   * Initialize a new Git repository at a specified path.
   *
   * @param path - path at which initialize a Git repository
   * @returns promise which resolves upon initializing a Git repository
   *
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  init(path: string): Promise<void>;

  /**
   * Retrieve commit logs.
   *
   * @param count - number of commits
   * @returns promise which resolves upon retrieving commit logs
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  log(historyCount?: number): Promise<Git.ILogResult>;

  /**
   * Fetch changes from a remote repository.
   *
   * @param auth - remote authentication information
   * @returns promise which resolves upon fetching changes
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  pull(auth?: Git.IAuth): Promise<Git.IPushPullResult>;

  /**
   * Push local changes to a remote repository.
   *
   * @param auth - remote authentication information
   * @returns promise which resolves upon pushing changes
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  push(auth?: Git.IAuth): Promise<Git.IPushPullResult>;

  /**
   * General Git refresh
   */
  refresh(): Promise<void>;

  /**
   * Make request for a list of all Git branches
   */
  refreshBranch(): Promise<void>;

  /**
   * Request Git status refresh
   */
  refreshStatus(): Promise<void>;

  /**
   * Register a new diff provider for specified file types
   *
   * @param filetypes File type list
   * @param callback Callback to use for the provided file types
   */
  registerDiffProvider(filetypes: string[], callback: Git.IDiffCallback): void;

  /**
   * Move files from the "staged" to the "unstaged" area.
   *
   * ## Notes
   *
   * -  If no filename is provided, moves all files from the "staged" to the "unstaged" area.
   *
   * @param filename - file path to be reset
   * @returns promise which resolves upon moving files
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  reset(filename?: string): Promise<void>;

  /**
   * Reset the repository to a specified commit.
   *
   * ## Notes
   *
   * -   If a commit hash is not provided, resets the repository to `HEAD`.
   *
   * @param hash - commit identifier (hash)
   * @returns promises which resolves upon resetting the repository
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  resetToCommit(hash: string): Promise<void>;

  /**
   * Revert changes made after a specified commit.
   *
   * @param message - commit message
   * @param hash - commit identifier (hash)
   * @returns promise which resolves upon reverting changes
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  revertCommit(message: string, hash: string): Promise<void>;

  /**
   * Make request for the prefix path of a directory 'path',
   * with respect to the root directory of repository
   *
   * @param path Path for which the prefix is searched for
   * @returns Path prefix
   *
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  showPrefix(path: string): Promise<Git.IShowPrefixResult>;

  /**
   * Make request for top level path of repository 'path'
   *
   * @param path Path from which the top Git repository needs to be found
   *
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  showTopLevel(path: string): Promise<Git.IShowTopLevelResult>;

  /**
   * Make request to list all the tags present in the remote repo
   *
   * @returns list of tags
   *
   * @throws {Git.NotInRepository} If the current path is not a Git repository
   * @throws {Git.GitResponseError} If the server response is not ok
   * @throws {ServerConnection.NetworkError} If the request cannot be made
   */
  tags(): Promise<Git.ITagResult>;

  /**
   * Toggle the mark for the file named fname
   *
   * @param fname Filename
   */
  toggleMark(fname: string): void;
}

export namespace Git {
  /** Function type for diffing a file's revisions */
  export type IDiffCallback = (
    filename: string,
    revisionA: string,
    revisionB: string
  ) => void;

  /**
   * Interface for GitAllHistory request result,
   * has all repo information
   */
  export interface IAllHistory {
    code: number;
    data?: {
      show_top_level?: IShowTopLevelResult;
      branch?: IBranchResult;
      log?: ILogResult;
      status?: IStatusResult;
    };
  }

  /**
   * Interface for server settings
   */
  export interface IServerSettings {
    /**
     * Frontend version formatted as Python package version
     */
    frontendVersion?: string;
    /**
     * Git version (X.Y.Z)
     */
    gitVersion?: string;
    /**
     * Server absolute root path (as posix)
     */
    serverRoot: string;
    /**
     * Server extension version formatted as Python package version
     */
    serverVersion: string;
  }

  /** Interface for GitShowTopLevel request result,
   * has the Git root directory inside a repository
   */
  export interface IShowTopLevelResult {
    code: number;
    top_repo_path?: string;
  }

  /** Interface for GitShowPrefix request result,
   * has the prefix path of a directory in a repository,
   * with respect to the root directory.
   */
  export interface IShowPrefixResult {
    code: number;
    under_repo_path?: string;
  }

  /**
   * Interface to call the checkout method
   *
   * If a branch name is provided, check it out (with or without creating it)
   * If a filename is provided, check the file out
   * If nothing is provided, check all files out
   */
  export interface ICheckoutOptions {
    /**
     * Branch name
     */
    branchname?: string;
    /**
     * Is it a new branch?
     */
    newBranch?: boolean;
    /**
     * The commit (branch name, tag, or commit id) to which a new branch HEAD will point.
     */
    startpoint?: string;
    /**
     * Filename
     */
    filename?: string;
  }

  /** Interface for GitCheckout request result.
   * For reporting errors in checkout
   */
  export interface ICheckoutResult {
    code: number;
    message?: string;
  }

  /**
   * Branch description interface
   */
  export interface IBranch {
    is_current_branch: boolean;
    is_remote_branch: boolean;
    name: string;
    upstream: string;
    top_commit: string;
    tag: string;
  }

  /** Interface for GitBranch request result,
   * has the result of fetching info on all branches
   */
  export interface IBranchResult {
    code: number;
    branches?: IBranch[];
    current_branch?: IBranch;
  }

  /**
   * Data interface of diffcontent request
   */
  export interface IDiffContent {
    /**
     * Current file content
     */
    curr_content: string;
    /**
     * Previous file content
     */
    prev_content: string;
  }

  /** Interface for GitStatus request result,
   * has the status of each changed file
   */
  export interface IStatusFileResult {
    x: string;
    y: string;
    to: string;
    from: string;
    is_binary: boolean | null;
  }

  /**
   * Changed file attributes
   */
  export interface IStatusFile extends IStatusFileResult {
    status: Status;
  }

  /** Interface for GitStatus request result,
   * has the status of the entire repo
   */
  export interface IStatusResult {
    code: number;
    files?: IStatusFileResult[];
  }

  /** Interface for changed_files request result
   * lists the names of files that have differences between two commits
   * or beween two branches, or that were changed by a single commit
   */
  export interface IChangedFilesResult {
    code: number;
    files?: string[];
  }

  /** Interface for GitLog request result,
   * has the info of a single past commit
   */
  export interface ISingleCommitInfo {
    commit: string;
    author: string;
    date: string;
    commit_msg: string;
    pre_commit: string;
  }

  /** Interface for GitCommit request result,
   * has the info of a committed file
   */
  export interface ICommitModifiedFile {
    modified_file_path: string;
    modified_file_name: string;
    insertion: string;
    deletion: string;
    is_binary: boolean | null;
  }

  /** Interface for GitDetailedLog request result,
   * has the detailed info of a single past commit
   */
  export interface ISingleCommitFilePathInfo {
    code: number;
    modified_file_note?: string;
    modified_files_count?: string;
    number_of_insertions?: string;
    number_of_deletions?: string;
    modified_files?: [ICommitModifiedFile];
  }

  /** Interface for GitLog request result,
   * has the info of all past commits
   */
  export interface ILogResult {
    code: number;
    commits?: [ISingleCommitInfo];
  }

  export interface IIdentity {
    name: string;
    email: string;
  }

  /**
   * Interface for the Git Auth request.
   */
  export interface IAuth {
    username: string;
    password: string;
  }

  /**
   * Structure for the request to the Git Clone API.
   */
  export interface IGitClone {
    current_path: string;
    clone_url: string;
    auth?: IAuth;
  }

  /**
   * Structure for the request to the Git Clone API.
   */
  export interface IPushPull {
    current_path: string;
    auth?: IAuth;
    cancel_on_conflict?: boolean;
  }

  /**
   * Structure for the result of the Git Clone API.
   */
  export interface ICloneResult {
    code: number;
    message?: string;
  }

  /**
   * Structure for the result of the Git Push & Pull API.
   */
  export interface IPushPullResult {
    code: number;
    message?: string;
  }

  /**
   * Interface for a marker obj
   */
  export interface IBranchMarker {
    add(fname: string, mark: boolean): void;

    get(fname: string): boolean;

    set(fname: string, mark: boolean): void;

    toggle(fname: string): void;
  }

  export type Status =
    | 'untracked'
    | 'staged'
    | 'unstaged'
    | 'partially-staged'
    | null;

  export interface ITagResult {
    code: number;
    message?: string;
    tags?: string[];
  }

  /**
   * A wrapped error for a fetch response.
   */
  export class GitResponseError extends ServerConnection.ResponseError {
    /**
     * Create a new response error.
     */
    constructor(
      response: Response,
      message = `Invalid response: ${response.status} ${response.statusText}`,
      traceback = '',
      json: ReadonlyJSONObject = {}
    ) {
      super(response, message);
      this.traceback = traceback; // traceback added in mother class in 2.2.x
      this._json = json;
    }

    /**
     * The error response JSON body
     */
    get json(): ReadonlyJSONObject {
      return this._json;
    }

    /**
     * The traceback associated with the error.
     */
    traceback: string;

    protected _json: ReadonlyJSONObject;
  }
  export class NotInRepository extends Error {
    constructor() {
      super('Not in a Git Repository');
    }
  }
}

/**
 * Log message severity.
 */
export type Severity = 'error' | 'warning' | 'info' | 'success';

/**
 * Interface describing a component log message.
 */
export interface ILogMessage {
  /**
   * Message severity.
   */
  severity: Severity;

  /**
   * Message text.
   */
  message: string;
}
