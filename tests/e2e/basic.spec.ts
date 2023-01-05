import { test, expect } from "@playwright/test"

test("homepage details", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(
    "Vite + Vue 3 + TypeScript + Tailwind Starter Template",
  )
  await expect(page.locator("h2").first()).toHaveText("Hello World Component")
})

test("looks like expected screenshot", async ({
  page,
  isMobile,
  hasTouch,
  viewport,
  deviceScaleFactor,
  headless,
}, testInfo) => {
  await page.goto("/")

  //   await expect(viewport?.width).toEqual(1280)
  const _v_w = viewport?.width || 0
  //   await expect(viewport?.height).toEqual(720)
  const _v_h = viewport?.height || 0
  //   await expect(isMobile).toBeFalsy()
  const _m = isMobile ? 1 : 0
  //   await expect(hasTouch).toBeFalsy()
  const _t = hasTouch ? 1 : 0
  //   await expect(deviceScaleFactor).toBeFalsy()
  const _dsf = deviceScaleFactor || 1
  // https://github.com/microsoft/playwright/issues/12683
  const _h = headless ? 1 : 0

  const prefix = `${testInfo.title}_v${_v_w}x${_v_h}_m${_m}_t${_t}_dsf${_dsf}_h${_h}`
  console.log(`prefix is set to ${prefix}`)

  const screenshotFilename = `${prefix}_1.png`

  const screenshotPath = testInfo.outputPath(screenshotFilename)

  //   await page.screenshot({
  //     path: screenshotPath,
  //     fullPage: true,
  //   })

  // await page.waitForLoadState("domcontentloaded")

  // await new Promise((resolve) => setTimeout(resolve, 1000))

  // ALT 1: take snapshot and store it, then compare then always add to test result

  const screenshotActual = await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    scale: "device",
  })

  await testInfo.attach(screenshotFilename, {
    body: screenshotActual,
    contentType: "image/png",
  })

  await expect(screenshotActual).toMatchSnapshot(screenshotFilename, {
    maxDiffPixelRatio: 0.01,
  })

  // ALT 2: snapshot-store-compare in one step; adds screenshot to test report only if failure

  await expect(page).toHaveScreenshot(screenshotFilename, {
    fullPage: true,
    scale: "device",
    maxDiffPixelRatio: 0.01,
  })
})
