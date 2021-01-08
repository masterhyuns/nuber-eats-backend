import { CoreOutput } from './entities/core.output';

export class CommonUtils {
  static output(error?: string): CoreOutput {
    return {
      ok: error && false,
      error,
    };
  }
}
