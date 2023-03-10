// refer
import {
  expect,
  devices,
  type PlaywrightTestConfig,
  Page,
  TestInfo,
} from "@playwright/test"
import {
  MatchOptions,
  takeMatchAttachScreenshotFunction,
  TakeOptions,
} from "./playwright-extend"

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  reporter: [
    ["line"],
    ["html", { open: "never", outputFolder: "test-report" }],
  ],
  webServer: {
    command: "yarn dev",
    url: "http://localhost:5173/",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Desktop Firefox",
      use: {
        browserName: "firefox",
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "Desktop Chrome",
      use: {
        browserName: "chromium",
        ...devices["Desktop Chrome"],
        channel: "chrome",
        launchOptions: {
          executablePath: "/usr/bin/google-chrome",
          args: ["--no-sandbox", "--no-zygote, --enable-use-zoom-for-dsf=true"],
          slowMo: 500,
        },
      },
    },
    {
      name: "Desktop Chromium",
      use: {
        browserName: "chromium",
        ...devices["Desktop Chrome"],
      },
    },
  ],
}

const takeMatchAttachScreenshot: takeMatchAttachScreenshotFunction<
  Promise<{
    message: () => string
    pass: boolean
  }>
> extends (...origParam: infer U) => infer R
  ? (_received: { page: Page; testInfo: TestInfo }, ...origParam: U) => R
  : never = async (
  _received: { page: Page; testInfo: TestInfo },
  screenshotFilename: string,
  takeOptions?: TakeOptions,
  matchOptions?: MatchOptions,
) => {
  const screenshotPath = _received.testInfo.outputPath(screenshotFilename)

  let screenshotActual = await _received.page.screenshot({
    ...takeOptions,
    path: screenshotPath,
  })

  try {
    await expect(screenshotActual).toMatchSnapshot(
      screenshotFilename,
      matchOptions,
    )
  } catch (error) {
    let msg =
      "\n\n\x1b[33mFirst screenshot did not match, trying second time..."
    if (error instanceof Error) {
      msg = error.message + msg
    }
    console.log(msg)

    screenshotActual = await _received.page.screenshot({
      ...takeOptions,
      path: screenshotPath,
    })

    await expect(screenshotActual).toMatchSnapshot(
      screenshotFilename,
      matchOptions,
    )
  }

  await _received.testInfo.attach(screenshotFilename, {
    body: screenshotActual,
    contentType: "image/png",
  })

  return {
    message: () => "passed",
    pass: true,
  }
}

// See https://playwright.dev/docs/test-advanced#add-custom-matchers-using-expectextend
expect.extend({
  takeMatchAttachScreenshot,
})

export default config
