import { chromium } from 'playwright';

async function verifyEditor() {
    const browser = await chromium.launch({ headless: true }); // Set headless: false to see it
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseUrl = 'http://localhost:3000';

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', exception => console.log('PAGE ERROR:', exception));
    page.on('response', response => {
        if (response.status() >= 400) {
            console.log(`HTTP ERROR: ${response.url()} ${response.status()}`);
        }
    });

    try {
        // 1. Login
        console.log('Logging in...');
        await page.goto(`${baseUrl}/admin/login`);
        await page.fill('input[type="email"]', 'admin@example.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button:has-text("Login")');
        await page.waitForURL(`${baseUrl}/admin/dashboard`);
        console.log('Login successful');

        // 2. Create Post
        console.log('Creating post...');
        const timestamp = Date.now();
        const title = `Playwright Test Post ${timestamp}`;
        const slug = `playwright-test-post-${timestamp}`;

        await page.goto(`${baseUrl}/admin/posts/new`);
        await page.fill('input[type="text"] >> nth=0', title); // Title
        await page.fill('input[type="text"] >> nth=1', slug); // Slug
        await page.selectOption('select', 'draft'); // Status
        await page.fill('input[type="text"] >> nth=2', 'test, playwright'); // Categories
        await page.fill('textarea', '# Hello from Playwright'); // Content
        await page.click('button:has-text("Create Post")');
        await page.waitForURL(`${baseUrl}/admin/posts`);
        console.log('Post created');

        // 3. Verify in List
        console.log('Verifying in list...');
        // Wait for the API call to complete
        await page.waitForResponse(resp => resp.url().includes('/api/admin/posts') && resp.status() === 200);

        // Wait for table to populate (either posts or "No posts found")
        await page.waitForSelector('tbody tr');

        const postRow = page.locator('tr', { hasText: title });
        const count = await postRow.count();

        if (count === 0) {
            console.log('Page content:', await page.content());
            throw new Error('Post not found in list');
        }
        console.log('Post found in list');

        // 4. Edit Post
        console.log('Editing post...');
        await postRow.getByText('Edit').click();
        await page.waitForURL(/\/admin\/posts\/\d+\/edit/);

        // Verify pre-filled data
        const titleValue = await page.inputValue('input[type="text"] >> nth=0');
        if (titleValue !== title) {
            throw new Error(`Expected title "${title}", got "${titleValue}"`);
        }

        // Update Title
        const updatedTitle = `${title} Updated`;
        await page.fill('input[type="text"] >> nth=0', updatedTitle);
        await page.click('button:has-text("Update Post")');
        await page.waitForURL(`${baseUrl}/admin/posts`);
        console.log('Post updated');

        // 5. Verify Update
        console.log('Verifying update...');
        // Wait for the API call to complete
        await page.waitForResponse(resp => resp.url().includes('/api/admin/posts') && resp.status() === 200);

        // Wait for table to populate
        await page.waitForSelector('tbody tr');

        const updatedRow = page.locator('tr', { hasText: updatedTitle });
        if (await updatedRow.count() === 0) {
            throw new Error('Updated post not found in list');
        }
        console.log('Update verified');

    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

verifyEditor();
