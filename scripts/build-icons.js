import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SOURCE_DIR = path.join(__dirname, '../src/resources/icons');
const ICON_DEST_DIR = path.join(__dirname, '../src/gen/icons');
const BASE_ICON_RELATIVE_PATH = '../../Icon.js';

// Ensure destination directory exists
if (!fs.existsSync(ICON_DEST_DIR)) {
    fs.mkdirSync(ICON_DEST_DIR, { recursive: true });
}

function toCamelCase(str) {
    // Handle cases where the string might start with digits followed by an underscore
    // Example: 6_folder -> folder
    const cleanStr = str.replace(/^\d+_/, '');

    return cleanStr.replace(/([-_][a-z0-9])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
}

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

function buildIcons() {
    console.log('Building icons...');
    const files = getAllFiles(ICON_SOURCE_DIR);
    const iconsMap = new Map();

    files.forEach(file => {
        if (!file.endsWith('.png')) return;

        const fileName = path.basename(file);
        // Match base name and size
        const match = fileName.match(/^(.*?)(?:[-_])?(16x16|32x32)?\.png$/);

        if (match) {
            let baseName = match[1];
            const size = match[2];

            const relativePath = path.relative(ICON_DEST_DIR, file);

            if (!iconsMap.has(baseName)) {
                iconsMap.set(baseName, {});
            }

            const iconData = iconsMap.get(baseName);
            if (size === '16x16') {
                iconData.small = relativePath;
            } else if (size === '32x32') {
                iconData.large = relativePath;
            } else {
                if (!iconData.large) iconData.large = relativePath;
            }
        }
    });

    iconsMap.forEach((paths, baseName) => {
        const camelCaseName = toCamelCase(baseName);
        const filePath = path.join(ICON_DEST_DIR, `${camelCaseName}.js`);

        // Convert paths to use forward slashes for cross-platform imports
        const smallPath = paths.small ? paths.small.replace(/\\/g, '/') : null;
        const largePath = paths.large ? paths.large.replace(/\\/g, '/') : null;

        let content = `import Icon from '${BASE_ICON_RELATIVE_PATH}';\n`;
        if (smallPath) content += `import smallPath from './${smallPath}';\n`;
        if (largePath) content += `import largePath from './${largePath}';\n`;

        content += `\nconst ${camelCaseName} = new Icon({\n`;
        if (smallPath) content += `  small: smallPath,\n`;
        if (largePath) content += `  large: largePath,\n`;
        content += `});\n\n`;
        content += `export default ${camelCaseName};\n`;

        fs.writeFileSync(filePath, content);
    });

    console.log(`Generated ${iconsMap.size} icon files.`);
}

function cleanIcons() {
    console.log('Cleaning generated icons...');
    if (fs.existsSync(ICON_DEST_DIR)) {
        const files = fs.readdirSync(ICON_DEST_DIR);
        files.forEach(file => {
            if (file.endsWith('.js')) {
                fs.unlinkSync(path.join(ICON_DEST_DIR, file));
            }
        });
    }
}

const args = process.argv.slice(2);
if (args.includes('--clean')) {
    cleanIcons();
} else {
    buildIcons();
}