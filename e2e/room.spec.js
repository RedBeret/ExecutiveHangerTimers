import { test, expect } from '@playwright/test'

// Full user journey against the REAL production Worker:
// two independent browser profiles share a room and see each other's timers.
test('two users share timers through a Squad Sync room', async ({ browser }) => {
  const contextA = await browser.newContext()
  const contextB = await browser.newContext()
  const userA = await contextA.newPage()
  const userB = await contextB.newPage()

  // User A opens Contested Zones and creates a room
  await userA.goto('/contested-zones')
  const createButton = userA.getByRole('button', { name: 'Create Room' })
  await expect(createButton).toBeVisible({ timeout: 15_000 }) // waits for config fetch
  await createButton.click()

  const codeButton = userA.getByLabel('Copy room code')
  await expect(codeButton).toBeVisible({ timeout: 15_000 })
  const code = (await codeButton.textContent()).match(/\d{4}/)[0]

  // User B joins with the code
  await userB.goto('/contested-zones')
  await expect(userB.getByPlaceholder('Code')).toBeVisible({ timeout: 15_000 })
  await userB.getByPlaceholder('Code').fill(code)
  await userB.getByRole('button', { name: 'Join', exact: true }).click()

  // Both see the squad presence
  await expect(userB.getByText('2 in run')).toBeVisible({ timeout: 15_000 })
  await expect(userA.getByText('2 in run')).toBeVisible({ timeout: 15_000 })

  // A syncs the vault door -> B's vault timer starts counting without any action
  await userA.getByRole('button', { name: 'Door Opened Now' }).click()
  await expect(userA.getByText('Closing in:')).toBeVisible({ timeout: 10_000 })
  await expect(userB.getByText('Closing in:')).toBeVisible({ timeout: 10_000 })

  // B leaves -> A's presence count drops
  await userB.getByRole('button', { name: 'Leave' }).click()
  await expect(userA.getByText('1 in run')).toBeVisible({ timeout: 15_000 })

  await contextA.close()
  await contextB.close()
})

test('joining a nonexistent room shows an error', async ({ page }) => {
  await page.goto('/contested-zones')
  await expect(page.getByPlaceholder('Code')).toBeVisible({ timeout: 15_000 })
  await page.getByPlaceholder('Code').fill('0042')
  await page.getByRole('button', { name: 'Join', exact: true }).click()
  await expect(page.getByText('Room not found or connection failed')).toBeVisible({ timeout: 15_000 })
})
