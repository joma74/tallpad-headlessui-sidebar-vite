import { PageScreenshotOptions } from "@playwright/test"

export type MatchOptions = {
  /**
   * An acceptable ratio of pixels that are different to the total amount of pixels, between `0` and `1`. Default is
   * configurable with `TestConfig.expect`. Unset by default.
   */
  maxDiffPixelRatio?: number

  /**
   * An acceptable amount of pixels that could be different. Default is configurable with `TestConfig.expect`. Unset by
   * default.
   */
  maxDiffPixels?: number

  /**
   * An acceptable perceived color difference in the [YIQ color space](https://en.wikipedia.org/wiki/YIQ) between the
   * same pixel in compared images, between zero (strict) and one (lax), default is configurable with
   * `TestConfig.expect`. Defaults to `0.2`.
   */
  threshold?: number
}

export type TakeOptions = Omit<PageScreenshotOptions, "path">

export type takeMatchAttachScreenshotFunction<R> = (
  screenshotFilename: string,
  takeOptions?: TakeOptions,
  matchOptions?: MatchOptions,
) => R

declare global {
  namespace PlaywrightTest {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Matchers<R, T> {
      takeMatchAttachScreenshot
    }
  }
}

export {}
