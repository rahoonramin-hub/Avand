import fs from 'fs';
import path from 'path';

/**
 * تابع تقسیم‌بندی فایل JSON
 * @param {string} inputFilePath - مسیر فایل JSON ورودی
 * @param {string} outputFolder - مسیر فولدر خروجی
 */
function splitJsonFile(inputFilePath, outputFolder) {
    // خواندن فایل ورودی
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('خطا در خواندن فایل:', err);
            return;
        }

        try {
            const jsonData = JSON.parse(data);

            // اطمینان از وجود فولدر خروجی
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder, { recursive: true });
            }

            // پیمایش کلیدها (L1, L2, ...) و ذخیره هر کدام
            Object.keys(jsonData).forEach((key) => {
                const outputFilePath = path.join(outputFolder, `${key}.json`);
                const content = JSON.stringify(jsonData[key], null, 2);

                fs.writeFile(outputFilePath, content, (err) => {
                    if (err) {
                        console.error(`خطا در ذخیره فایل ${key}:`, err);
                    } else {
                        console.log(`فایل ${key}.json با موفقیت ساخته شد.`);
                    }
                });
            });
        } catch (parseErr) {
            console.error('خطا در پارس کردن فایل JSON:', parseErr);
        }
    });
}

const inputFile = 'beginner.json'; // مسیر فایل ورودی شما
const outputDir = '../Beginner'; // مسیر فولدر خروجی

splitJsonFile(inputFile, outputDir);